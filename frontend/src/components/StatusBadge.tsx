import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

type Status = 'pending' | 'approved' | 'rejected' | 'disputed';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    colorClass: 'bg-status-pending text-foreground',
    key: 'status.pending',
  },
  approved: {
    icon: CheckCircle,
    colorClass: 'bg-status-approved text-primary-foreground',
    key: 'status.approved',
  },
  rejected: {
    icon: XCircle,
    colorClass: 'bg-status-rejected text-destructive-foreground',
    key: 'status.rejected',
  },
  disputed: {
    icon: AlertTriangle,
    colorClass: 'bg-status-disputed text-primary-foreground',
    key: 'status.disputed',
  },
};

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.colorClass} ${className} flex items-center gap-1 px-3 py-1`}>
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{t(config.key)}</span>
    </Badge>
  );
};
