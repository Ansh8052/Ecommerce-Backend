/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../../app');
const authConstant = require('../../constants/authConstant');
const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let insertedUser = {};

/**
 * @description : model dependencies resolver
 */
beforeAll(async function (){
  try {
    await client.connect();
    const dbInstance = client.db('EcomDb_test');

    const user = dbInstance.collection('users');
    insertedUser = await user.insertOne({
      username: 'Zella92',
      password: 'bqyDk93ca9mmjgb',
      email: 'Valerie_Bashirian@gmail.com',
      name: 'Alison Nitzsche',
      shippingAddress: [
        {
          _id: false,
          pincode: 'sensor',
          address1: 'District',
          address2: 'Home',
          landmark: 'definition',
          city: 'Sharable',
          isDefault: true,
          state: 'Tuna',
          addressType: 'azure',
          fullName: 'firewall',
          mobile: 446,
          addressNo: 212
        }
      ],
      wishlist: [ {
        _id: false,
        productId: 'Fantastic' 
      } ],
      userType: 164,
      mobileNo: '(678) 507-8211',
      resetPasswordLink: {},
      loginRetryLimit: 239,
      loginReactiveTime: '2024-03-14T18:35:09.818Z',
      id: '65d73354fdd00c08c437be7f'
    });
  }
  catch (error) {
    console.error(`we encountered ${error}`);
  }
  finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a user', async () => {
    let registeredUser = await request(app)
      .post('/device/auth/register')
      .send({
        'username':'Milo_Kris',
        'password':'g0Y1tueh9HFJ6qP',
        'email':'Keanu_Boyle27@gmail.com',
        'name':'Johnathan Bergstrom',
        'shippingAddress':[{
          '_id':false,
          'pincode':'Frozen',
          'address1':'Tanzania',
          'address2':'SSL',
          'landmark':'Pants',
          'city':'Uganda',
          'isDefault':true,
          'state':'engage',
          'addressType':'killer',
          'fullName':'Customizable',
          'mobile':893,
          'addressNo':739
        }],
        'wishlist':[{
          '_id':false,
          'productId':'PCI'
        }],
        'userType':authConstant.USER_TYPES.User,
        'mobileNo':'(780) 301-4814',
        'addedBy':insertedUser.insertedId,
        'updatedBy':insertedUser.insertedId
      });
    expect(registeredUser.statusCode).toBe(200);
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
  });
});

describe('POST /login -> if username and password is correct', () => {
  test('should return user with authentication token', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Milo_Kris',
          password: 'g0Y1tueh9HFJ6qP'
        }
      );
    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('SUCCESS');
    expect(user.body.data).toMatchObject({
      id: expect.any(String),
      token: expect.any(String)
    }); 
  });
});

describe('POST /login -> if username is incorrect', () => {
  test('should return unauthorized status and user not exists', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'wrong.username',
          password: 'g0Y1tueh9HFJ6qP'
        }
      );

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /login -> if password is incorrect', () => {
  test('should return unauthorized status and incorrect password', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Milo_Kris',
          password: 'wrong@password'
        }
      );

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /login -> if username or password is empty string or has not passed in body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/login')
      .send({});

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ email: '' });

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(user.statusCode).toBe(404);
    expect(user.body.status).toBe('RECORD_NOT_FOUND');
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    let user = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email':'Keanu_Boyle27@gmail.com', });

    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('SUCCESS');
  });
});

describe('POST /validate-otp -> OTP is sent in request body and OTP is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Milo_Kris',
          password: 'g0Y1tueh9HFJ6qP'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .post('/device/auth/validate-otp')
              .send({ 'otp': foundUser.body.data.resetPasswordLink.code, }).then(user => {
                expect(user.statusCode).toBe(200);
                expect(user.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({ 'otp': '12334' });
    
    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('FAILURE');
    
  });
});

describe('POST /validate-otp -> if request body is empty or OTP has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .post('/device/auth/validate-otp')
      .send({});

    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Milo_Kris',
          password: 'g0Y1tueh9HFJ6qP'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/user/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .put('/device/auth/validate-otp')
              .send({
                'code': foundUser.body.data.resetPasswordLink.code,
                'newPassword':'newPassword'
              }).then(user => {
                expect(user.statusCode).toBe(200);
                expect(user.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({});
    
    expect(user.statusCode).toBe(400);
    expect(user.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let user = await request(app)
      .put('/device/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(user.statusCode).toBe(200);
    expect(user.body.status).toBe('FAILURE');

  });
});

afterAll(function (done) {
  db.connection.db.dropDatabase(function () {
    db.connection.close(function () {
      done();
    });
  });
});
