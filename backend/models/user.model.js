// User model schema definition
// In a real implementation, this would define the database schema using an ORM like Sequelize or Mongoose

/**
 * User schema - mock implementation
 * 
 * In a real project, this would be implemented with a proper ORM/ODM
 * such as Mongoose (for MongoDB) or Sequelize (for SQL databases)
 */
class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password; // In real app, this would be hashed
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
  
  // Sample static methods that would interact with the database
  
  static async findById(id) {
    // This would query the database in a real implementation
    console.log(`Finding user with id: ${id}`);
    return null; // Mock response
  }
  
  static async findByEmail(email) {
    // This would query the database in a real implementation
    console.log(`Finding user with email: ${email}`);
    return null; // Mock response
  }
  
  static async create(userData) {
    // This would create a user in the database in a real implementation
    console.log('Creating user with data:', userData);
    return new User({
      id: 'generated-id',
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  // Instance methods
  
  async save() {
    // This would save changes to the database in a real implementation
    console.log('Saving user:', this);
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = User;