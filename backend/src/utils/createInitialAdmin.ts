import { getRepository } from 'typeorm';
import { User } from '../entities';
import { INITIAL_ADMIN_PASS } from '../config';

/**
 * Create initial admin if there isn't one already
 */
export const createInitialAdmin = async () => {
  const userRepository = getRepository(User);

  /**
   * Get all admins from db
   */
  const admins = await userRepository.find({
    where: {
      role: 'Admin'
    }
  });

  const newAdmin = new User();

  newAdmin.name = 'LuncherBox Admin User';
  newAdmin.email = 'admin@deliriumproducts.me';
  newAdmin.role = 'Admin';
  newAdmin.isVerified = true;
  newAdmin.password = INITIAL_ADMIN_PASS;

  if (!admins.length) {
    await userRepository.save(newAdmin);
  }
};
