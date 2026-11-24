import React from 'react';
import { Clock, FlaskConical, ShieldCheck, Users } from 'lucide-react';
import type { FreshnessStatus } from '../types/campus';

interface SourceLabelProps {
  type: 'official' | 'demo' | 'community';
  compact?: boolean;
}

export const SourceLabel: React.FC<SourceLabelProps> = () => null;
export const FreshnessBadge: React.FC<{status?: FreshnessStatus;lastChecked?:string}> = () => null;

