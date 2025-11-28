import { Role } from '../models/Role.js';

// Middleware kiểm tra quyền dựa trên roleId
export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Lấy roleId từ user hoặc admin đã được authenticate
      const roleId = req.user?.roleId || req.admin?.roleId;

      if (!roleId) {
        return res.status(403).json({
          success: false,
          message: 'Không tìm thấy thông tin phân quyền'
        });
      }

      // Tìm role trong database
      const role = await Role.findOne({ roleId });

      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Role không tồn tại'
        });
      }

      // Kiểm tra role có trong danh sách được phép không
      if (!allowedRoles.includes(role.roleId)) {
        return res.status(403).json({
          success: false,
          message: `Bạn không có quyền truy cập. Yêu cầu role: ${allowedRoles.join(', ')}`
        });
      }

      // Gắn thông tin role vào request
      req.role = {
        roleId: role.roleId,
        roleName: role.roleName,
        description: role.description
      };

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra quyền',
        error: error.message
      });
    }
  };
};

// Middleware chỉ cho phép admin
export const requireAdminRole = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền truy cập'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực admin',
      error: error.message
    });
  }
};

export default requireRole;
