const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialect: 'postgres',
});

const User = conn.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const syncAndSeed = () => {
  return conn.sync({ force: true }).then(async () => {
    const [moe, larry, curly] = await Promise.all([
      User.create({
        firstName: 'moe',
        lastName: 'j',
      }),
      User.create({
        firstName: 'larry',
        lastName: 'k',
      }),
      User.create({
        firstName: 'curly',
        lastName: 'l',
      }),
    ]);
  });
};

const getUsers = async id => {
  const users = await User.findAll().then(allUsers => {
    let usr;
    const users = {};
    for (let key in allUsers) {
      users[key] = allUsers[key].get();
      if (id === allUsers[key].get()['id']) {
        usr = allUsers[key].get();
      }
    }

    return [users, usr];
  });
  return users;
};

const createUser = async (first, last) => {
  const user = await User.create({
    firstName: first,
    lastName: last,
  });
};

const updateUser = async (first, last, idVal) => {
  const [usrsUpdatedCount, updatedUsrs] = await User.update(
    { firstName: first, lastName: last },
    {
      where: {
        id: idVal,
      },
      returning: true,
    }
  );
};

const deleteUser = async idToDelete => {
  await User.destroy({
    where: {
      id: idToDelete,
    },
  });
};

module.exports = {
  conn,
  syncAndSeed,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
