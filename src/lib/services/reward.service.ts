import prisma from '../prisma';
import { RewardStatus } from '@prisma/client';

export class RewardService {
  // Get all available rewards
  static async getAvailableRewards() {
    return prisma.reward.findMany({
      where: { available: true },
      orderBy: { requiredCredit: 'asc' },
    });
  }

  // Get user plastic credit (dummy: sum of all COMPLETED pickups' plastic weight)
  static async getUserCredit(userId: string) {
    // For demo: sum all completed pickups with PLASTIC in wasteTypes
    const pickups = await prisma.pickup.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        wasteTypes: { has: 'PLASTIC' },
      },
    });
    // Sum estimatedWeight for PLASTIC pickups
    return pickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
  }

  // Get user reward history
  static async getUserRewardHistory(userId: string) {
    return prisma.rewardHistory.findMany({
      where: { userId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  // Redeem a reward
  static async redeemReward(userId: string, rewardId: string) {
    // Check reward
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward || !reward.available) throw new Error('Reward tidak tersedia');
    // Check user credit
    const credit = await this.getUserCredit(userId);
    if (credit < reward.requiredCredit) throw new Error('Kredit plastik tidak cukup');
    // Create reward history
    return prisma.rewardHistory.create({
      data: {
        userId,
        rewardId,
        status: RewardStatus.PENDING,
      },
    });
  }
}
