module deeds::land_registry {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    // ============================================
    // ERROR CODES
    // ============================================
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_COUNCIL_MEMBER: u64 = 3;
    const E_ALREADY_APPROVED: u64 = 4;
    const E_PARCEL_NOT_FOUND: u64 = 5;
    const E_NOT_OWNER: u64 = 6;
    const E_NOT_APPROVED: u64 = 7;
    const E_PARCEL_IMMUTABLE: u64 = 8;
    const E_NOT_DEPLOYER: u64 = 9;

    // ============================================
    // STATUS CONSTANTS
    // ============================================
    const STATUS_PENDING: u8 = 0;
    const STATUS_APPROVED: u8 = 1;
    const STATUS_REJECTED: u8 = 2;
    const STATUS_DISPUTED: u8 = 3;

    // Minimum approvals required
    const MIN_APPROVALS: u64 = 2;

    // ============================================
    // STRUCTS
    // ============================================

    /// Main land parcel structure
    struct LandParcel has store, drop, copy {
        parcel_id: u64,
        owner: address,
        khasra_number: String,
        document_cid: String,
        area_sqm: u64,
        notes: String,
        village: String,
        tehsil: String,
        district: String,
        approvers: vector<address>,
        status: u8,
        created_at: u64
    }

    /// Global registry resource stored at module address
    struct Registry has key {
        next_parcel_id: u64,
        parcels: Table<u64, LandParcel>,
        council_members: vector<address>,
        deployer: address
    }

    // ============================================
    // EVENTS
    // ============================================

    #[event]
    struct LandSubmitted has drop, store {
        parcel_id: u64,
        owner: address
    }

    #[event]
    struct LandApproved has drop, store {
        parcel_id: u64,
        approver: address
    }

    #[event]
    struct LandRejected has drop, store {
        parcel_id: u64,
        approver: address
    }

    #[event]
    struct LandDisputed has drop, store {
        parcel_id: u64,
        initiator: address
    }

    #[event]
    struct OwnershipTransferred has drop, store {
        parcel_id: u64,
        from: address,
        to: address
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /// Initialize the registry with council members
    /// Can only be called once by the contract deployer
    public entry fun init(deployer: &signer, council: vector<address>) {
        let deployer_addr = signer::address_of(deployer);
        
        // Ensure not already initialized
        assert!(!exists<Registry>(deployer_addr), E_ALREADY_INITIALIZED);

        // Create and move registry to deployer address
        move_to(deployer, Registry {
            next_parcel_id: 0,
            parcels: table::new(),
            council_members: council,
            deployer: deployer_addr
        });
    }

    // ============================================
    // LAND SUBMISSION
    // ============================================

    /// Submit a new land parcel for registration
    /// Anyone can submit a land parcel
    public entry fun submit_land(
        owner: &signer,
        khasra_number: String,
        document_cid: String,
        area_sqm: u64,
        notes: String,
        village: String,
        tehsil: String,
        district: String
    ) acquires Registry {
        let owner_addr = signer::address_of(owner);
        let registry = borrow_global_mut<Registry>(@deeds);
        
        let parcel_id = registry.next_parcel_id;
        registry.next_parcel_id = parcel_id + 1;

        let parcel = LandParcel {
            parcel_id,
            owner: owner_addr,
            khasra_number,
            document_cid,
            area_sqm,
            notes,
            village,
            tehsil,
            district,
            approvers: vector::empty(),
            status: STATUS_PENDING,
            created_at: timestamp::now_seconds()
        };

        table::add(&mut registry.parcels, parcel_id, parcel);

        // Emit event
        event::emit(LandSubmitted {
            parcel_id,
            owner: owner_addr
        });
    }

    // ============================================
    // COUNCIL ACTIONS
    // ============================================

    /// Approve a land parcel (council members only)
    /// Requires minimum 2 signatures to change status to Approved
    public entry fun approve(council_member: &signer, parcel_id: u64) acquires Registry {
        let member_addr = signer::address_of(council_member);
        let registry = borrow_global_mut<Registry>(@deeds);

        // Verify council membership
        assert!(is_council_member(&registry.council_members, member_addr), E_NOT_COUNCIL_MEMBER);

        // Get parcel
        assert!(table::contains(&registry.parcels, parcel_id), E_PARCEL_NOT_FOUND);
        let parcel = table::borrow_mut(&mut registry.parcels, parcel_id);

        // Ensure not already approved by this member
        assert!(!vector::contains(&parcel.approvers, &member_addr), E_ALREADY_APPROVED);

        // Ensure parcel is not already in final approved state
        assert!(parcel.status != STATUS_APPROVED, E_PARCEL_IMMUTABLE);

        // Add approver
        vector::push_back(&mut parcel.approvers, member_addr);

        // Check if minimum approvals met
        if (vector::length(&parcel.approvers) >= MIN_APPROVALS) {
            parcel.status = STATUS_APPROVED;
        };

        // Emit event
        event::emit(LandApproved {
            parcel_id,
            approver: member_addr
        });
    }

    /// Reject a land parcel (council members only)
    public entry fun reject(council_member: &signer, parcel_id: u64) acquires Registry {
        let member_addr = signer::address_of(council_member);
        let registry = borrow_global_mut<Registry>(@deeds);

        // Verify council membership
        assert!(is_council_member(&registry.council_members, member_addr), E_NOT_COUNCIL_MEMBER);

        // Get parcel
        assert!(table::contains(&registry.parcels, parcel_id), E_PARCEL_NOT_FOUND);
        let parcel = table::borrow_mut(&mut registry.parcels, parcel_id);

        // Set status to rejected
        parcel.status = STATUS_REJECTED;

        // Emit event
        event::emit(LandRejected {
            parcel_id,
            approver: member_addr
        });
    }

    /// Mark a land parcel as disputed (council members only)
    public entry fun dispute(council_member: &signer, parcel_id: u64) acquires Registry {
        let member_addr = signer::address_of(council_member);
        let registry = borrow_global_mut<Registry>(@deeds);

        // Verify council membership
        assert!(is_council_member(&registry.council_members, member_addr), E_NOT_COUNCIL_MEMBER);

        // Get parcel
        assert!(table::contains(&registry.parcels, parcel_id), E_PARCEL_NOT_FOUND);
        let parcel = table::borrow_mut(&mut registry.parcels, parcel_id);

        // Set status to disputed
        parcel.status = STATUS_DISPUTED;

        // Emit event
        event::emit(LandDisputed {
            parcel_id,
            initiator: member_addr
        });
    }

    // ============================================
    // OWNERSHIP TRANSFER
    // ============================================

    /// Transfer ownership of an approved land parcel
    /// Only the current owner can transfer
    public entry fun transfer_ownership(
        old_owner: &signer,
        parcel_id: u64,
        new_owner: address
    ) acquires Registry {
        let old_owner_addr = signer::address_of(old_owner);
        let registry = borrow_global_mut<Registry>(@deeds);

        // Get parcel
        assert!(table::contains(&registry.parcels, parcel_id), E_PARCEL_NOT_FOUND);
        let parcel = table::borrow_mut(&mut registry.parcels, parcel_id);

        // Verify ownership
        assert!(parcel.owner == old_owner_addr, E_NOT_OWNER);

        // Verify approved status
        assert!(parcel.status == STATUS_APPROVED, E_NOT_APPROVED);

        // Transfer ownership
        parcel.owner = new_owner;

        // Emit event
        event::emit(OwnershipTransferred {
            parcel_id,
            from: old_owner_addr,
            to: new_owner
        });
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /// Get a land parcel by ID
    #[view]
    public fun get_parcel(parcel_id: u64): LandParcel acquires Registry {
        let registry = borrow_global<Registry>(@deeds);
        assert!(table::contains(&registry.parcels, parcel_id), E_PARCEL_NOT_FOUND);
        *table::borrow(&registry.parcels, parcel_id)
    }

    /// Get the next parcel ID
    #[view]
    public fun get_next_parcel_id(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@deeds);
        registry.next_parcel_id
    }

    /// Get all council members
    #[view]
    public fun get_council_members(): vector<address> acquires Registry {
        let registry = borrow_global<Registry>(@deeds);
        registry.council_members
    }

    /// Check if an address is a council member
    #[view]
    public fun is_council(addr: address): bool acquires Registry {
        let registry = borrow_global<Registry>(@deeds);
        is_council_member(&registry.council_members, addr)
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    /// Helper to check if address is in council
    fun is_council_member(council: &vector<address>, addr: address): bool {
        vector::contains(council, &addr)
    }

    // ============================================
    // TESTS
    // ============================================

    #[test_only]
    use std::string;

    #[test(deployer = @deeds, user = @0x123, council1 = @0x456, council2 = @0x789)]
    public fun test_full_workflow(
        deployer: &signer,
        user: &signer,
        council1: &signer,
        council2: &signer
    ) acquires Registry {
        // Setup
        timestamp::set_time_has_started_for_testing(deployer);
        let council = vector::empty();
        vector::push_back(&mut council, signer::address_of(council1));
        vector::push_back(&mut council, signer::address_of(council2));

        // Initialize
        init(deployer, council);

        // Submit land
        submit_land(
            user,
            string::utf8(b"KH-123"),
            string::utf8(b"QmTest123"),
            1000,
            string::utf8(b"Agricultural land"),
            string::utf8(b"Village A"),
            string::utf8(b"Tehsil B"),
            string::utf8(b"District C")
        );

        // Approve by council members
        approve(council1, 0);
        approve(council2, 0);

        // Verify status
        let parcel = get_parcel(0);
        assert!(parcel.status == STATUS_APPROVED, 0);
        assert!(vector::length(&parcel.approvers) == 2, 1);
    }
}