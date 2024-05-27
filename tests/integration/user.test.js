import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';

let resetToken, loginToken, userMail;

describe('User APIs Test', () => {
  beforeAll(async () => {
    const clearCollections = async () => {
      for (const collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteOne();
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST, {
        useNewUrlParser: true
      });
      await clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      await mongooseConnect();
    } else {
      await clearCollections();
    }
  });

  describe('New User', () => {
    it('Should return user object', async () => {
      const res = await request(app).post('/api/users').send({
        first_name: 'Nick',
        last_name: 'N',
        email: 'nick@gmail.com',
        password: 'Cham@234'
      });
      userId = res.body.data._id;
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toBeInstanceOf(Object);
    });
  });

  describe('New User', () => {
    it('Invalid password format', async () => {
      const res = await request(app).post('/api/users').send({
        first_name: 'Nick',
        last_name: 'N',
        email: 'nick@gmail.com',
        password: 'cham@234'
      });
      userId = res.body.data._id;
      userMail = res.body.data.email;
      expect(res.statusCode).toBe(500);
    });
  });

  describe('Login User', () => {
    it('Should return token', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'nick@gmail.com',
        password: 'Cham@234'
      });
      loginToken = res.body.data;
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Login User', () => {
    it('Invalid User', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'nnick@gmail.com',
        password: 'Cham@234'
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Forgot Password', () => {
    it('Should send reset mail', async () => {
      const res = await request(app).post('/api/users/forget').send({
        email: 'nick@gmail.com'
      });
      resetToken = res.body.data;
      expect(res.statusCode).toBe(200);
    });
  });
  describe('Reset Password', () => {
    it('Should reset the password', async () => {
      const res = await request(app)
        .put('/api/users/reset')
        .set('Authorization', `Bearer ${resetToken}`)
        .send({ password: 'Chammmm@234' });

      expect(res.statusCode).toBe(200);
    });
  });
});

describe('Reset Password', () => {
  it('Invalid format', async () => {
    const res = await request(app)
      .put('/api/users/reset')
      .set('Authorization', `Bearer ${resetToken}`)
      .send({ password: 'chammmm@234' });

    expect(res.statusCode).toBe(500);
  });
});

describe('Note APIs Test', () => {
  let noteId;
  beforeAll(async () => {
    const clearCollections = async () => {
      for (const collection in mongoose.connection.collections) {
        await mongoose.connection.collections[collection].deleteOne();
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST, {
        useNewUrlParser: true
      });
      await clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      await mongooseConnect();
    } else {
      await clearCollections();
    }
  });

  describe('Fetch Notes', () => {
    it('Should return note objects', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.body.data.createdBy).toEqual(userMail);
    });
  });

  describe('Create Note', () => {
    it('Should return token', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${loginToken}`)
        .send({
          title: 'ToDo',
          description: 'ToDo'
        });

      expect(res.statusCode).toBe(201);
      noteId = res.body.data._id;
    });
  });

  describe('Create Note', () => {
    it(' Invalid title', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${loginToken}`)
        .send({
          title: 'To',
          description: 'ToDo'
        });

      expect(res.statusCode).toBe(500);
    });
  });

  describe('Update Note', () => {
    it('Should update note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`)
        .send({
          title: 'TooDo',
          description: 'ToDO'
        });

      expect(res.statusCode).toBe(202);
    });
  });

  describe('Get Note By Id', () => {
    it('Should return note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.statusCode).toBe(201);
    });
  });

  describe('Archive Note By Id', () => {
    it('Should toggle archive', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}/archive`)
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.body.data.isArchive).toEqual(true);
    });
  });

  describe('Inserting Note to the Trash By Id', () => {
    it('Should toggle trash', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}/trash`)
        .set('Authorization', `Bearer ${loginToken}`);
      expect(res.body.data.isTrash).toEqual(true);
    });
  });

  describe('Delete Note By Id', () => {
    it('Should delete note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${loginToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
