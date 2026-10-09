export type OwnedRecord = { ownerId: string; deletedAt: Date | null };

export function canAccessRecord(record: OwnedRecord, ownerId: string): boolean {
  return record.ownerId === ownerId && record.deletedAt === null;
}

export function ownerWhere(ownerId: string): { ownerId: string; deletedAt: null } {
  return { ownerId, deletedAt: null };
}
