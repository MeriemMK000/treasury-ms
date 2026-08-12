import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.headers['x-group-id'] || request.query.groupId;
    
    if (!user) throw new ForbiddenException('Utilisateur non authentifié');
    
    if (groupId && user.groupId !== groupId && user.role !== 'super_admin') {
      throw new ForbiddenException('Accès non autorisé à ce groupe');
    }
    
    request.tenantGroupId = groupId || user.groupId;
    return true;
  }
}
