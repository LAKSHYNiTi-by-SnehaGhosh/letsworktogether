import { prisma } from '../src/lib/prisma';

const roles = [
  { name: 'Owner', description: 'Full access to everything in the organization.' },
  { name: 'Admin', description: 'Administrative access, cannot delete organization.' },
  { name: 'Manager', description: 'Can manage projects, tasks, and users.' },
  { name: 'Employee', description: 'Can view projects and manage own tasks.' },
  { name: 'Client', description: 'Read-only access to specific projects and invoices.' },
  { name: 'Guest', description: 'Minimal access to shared resources.' },
];

const permissions = [
  // Admin / Owner
  { name: 'org:manage', resource: 'org', action: 'manage', description: 'Manage organization settings' },
  { name: 'billing:manage', resource: 'billing', action: 'manage', description: 'Manage billing and invoices' },
  { name: 'members:manage', resource: 'members', action: 'manage', description: 'Manage members and roles' },
  // Manager
  { name: 'projects:manage', resource: 'projects', action: 'manage', description: 'Create and manage projects' },
  { name: 'tasks:manage', resource: 'tasks', action: 'manage', description: 'Create and manage tasks' },
  // Employee
  { name: 'projects:read', resource: 'projects', action: 'read', description: 'View projects' },
  { name: 'tasks:read', resource: 'tasks', action: 'read', description: 'View tasks' },
  { name: 'tasks:write', resource: 'tasks', action: 'write', description: 'Update tasks' },
  // Client
  { name: 'invoices:read', resource: 'invoices', action: 'read', description: 'View invoices' },
];

const rolePermissionsMap = {
  Owner: ['org:manage', 'billing:manage', 'members:manage', 'projects:manage', 'tasks:manage', 'projects:read', 'tasks:read', 'tasks:write', 'invoices:read'],
  Admin: ['billing:manage', 'members:manage', 'projects:manage', 'tasks:manage', 'projects:read', 'tasks:read', 'tasks:write', 'invoices:read'],
  Manager: ['projects:manage', 'tasks:manage', 'projects:read', 'tasks:read', 'tasks:write', 'invoices:read'],
  Employee: ['projects:read', 'tasks:read', 'tasks:write'],
  Client: ['projects:read', 'tasks:read', 'invoices:read'],
  Guest: ['projects:read'],
};

async function main() {
  console.log('Seeding permissions...');
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {
        description: p.description,
        resource: p.resource,
        action: p.action,
      },
      create: p,
    });
  }

  console.log('Seeding roles...');
  for (const r of roles) {
    const role = await prisma.role.findFirst({ where: { name: r.name, organizationId: null } });
    let roleId;
    if (role) {
      roleId = role.id;
    } else {
      const newRole = await prisma.role.create({
        data: {
          name: r.name,
          description: r.description,
        },
      });
      roleId = newRole.id;
    }

    // Link permissions
    const perms = rolePermissionsMap[r.name as keyof typeof rolePermissionsMap];
    for (const pName of perms) {
      const perm = await prisma.permission.findUnique({ where: { name: pName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId: perm.id,
            },
          },
          update: {},
          create: {
            roleId,
            permissionId: perm.id,
          },
        });
      }
    }
  }
  
  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
