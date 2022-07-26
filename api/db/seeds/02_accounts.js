exports.seed = async (knex) => {
  const result = await knex.count("id as count").from("accounts").first();
  if (result.count < 1) {
    await knex("accounts").insert([
      {
        ci: 123456789,
        password:
          "$2a$10$9bBQa/c.qJeJVvBfFjD1YOXMsjs9Q9b9S9OB9Nw0VkaDUGXb9n11u",
        email: "backoffice@textum.com.uy",
        active: true,
        type: "ADMINISTRADOR",
      },
      {
        ci: 987654321,
        password:
          "$2a$10$9bBQa/c.qJeJVvBfFjD1YOXMsjs9Q9b9S9OB9Nw0VkaDUGXb9n11u",
        email: "usuario1@textum.com.uy",
        active: true,
        type: "USUARIO",
        tenant_id: 1,
      },
      {
        ci: 987654322,
        password:
          "$2a$10$9bBQa/c.qJeJVvBfFjD1YOXMsjs9Q9b9S9OB9Nw0VkaDUGXb9n11u",
        email: "usuario2@textum.com.uy",
        active: true,
        type: "USUARIO",
        tenant_id: 1,
      },
      {
        ci: 987654323,
        password:
          "$2a$10$9bBQa/c.qJeJVvBfFjD1YOXMsjs9Q9b9S9OB9Nw0VkaDUGXb9n11u",
        email: "usuario3@textum.com.uy",
        active: true,
        type: "USUARIO",
        tenant_id: 1,
      },
      {
        ci: 987654324,
        password:
          "$2a$10$9bBQa/c.qJeJVvBfFjD1YOXMsjs9Q9b9S9OB9Nw0VkaDUGXb9n11u",
        email: "usuario4@textum.com.uy",
        active: true,
        type: "USUARIO",
        tenant_id: 1,
      },
    ]);
  }
};
