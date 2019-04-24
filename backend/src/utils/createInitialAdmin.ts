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
  const admin = await userRepository.findOne({
    where: {
      role: 'Admin',
      email: 'admin@deliriumproducts.me'
    }
  });

  if (!admin) {
    const newAdmin = new User();

    newAdmin.name = 'LuncherBox Admin User';
    newAdmin.email = 'admin@deliriumproducts.me';
    newAdmin.role = 'Admin';
    newAdmin.isVerified = true;
    newAdmin.password = INITIAL_ADMIN_PASS;

    await userRepository.save(newAdmin);
  }
};
