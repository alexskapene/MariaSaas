import { AuditLog, AuditAction } from '../types'


class AuditService {
  private static instance: AuditService
  private logs: AuditLog[] = []

  // Private constructor for singleton pattern
  private constructor() {}

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  public async logAction(params: {
    userId: string;
    userName: string;
    action: AuditAction;
    resource: string;
    details: string;
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  }): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      userId: params.userId,
      userName: params.userName,
      action: params.action,
      resource: params.resource,
      details: params.details,
      severity: params.severity || 'INFO'
    };

    // Dans un environnement réel, ceci serait un appel API vers une DB sécurisée
    this.logs.unshift(newLog);
    console.info(`[AUDIT] ${newLog.action} by ${newLog.userName}: ${newLog.details}`);
    return newLog;
  }

  public getLogs(): AuditLog[] {
    return this.logs;
  }
}

export const auditService = AuditService.getInstance();
