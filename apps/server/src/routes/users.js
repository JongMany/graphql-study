import { readDB } from "../dbController.js";

const getUsers = () => readDB("users");

const usersRoutes = [
  {
    method: "get",
    route: "/users",
    handler: (req, res) => {
      const users = getUsers();
      res.send(users);
    },
  },
  {
    method: "get",
    route: "/users/:id",
    handler: (req, res) => {
      try {
        const {
          params: { id },
        } = req;
        const users = getUsers();
        const targetUser = users[id];

        if (!targetUser) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send(targetUser);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    },
  },
];

export default usersRoutes;
