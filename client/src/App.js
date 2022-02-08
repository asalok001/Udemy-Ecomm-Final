import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';
import CompleteRegistrationForm from './pages/auth/CompleteRegistrationForm';
import ForgetPassword from './pages/auth/ForgetPassword';
import History from './pages/user/History';
import UserRoute from './components/routes/UserRoute';
import AdminRoute from './components/routes/AdmnRoute';
import CreateCategory from './pages/admin/category/CreateCategory';

import { currentUser } from './functions/auth';
import { auth } from './firebase';
import Password from './pages/user/Password';
import Wishlist from './pages/user/WishList';
import AdminDashboard from './pages/admin/AdminDashboard';
import UpdateCategory from './pages/admin/category/UpdateCategory';
import SubCreate from './pages/admin/category/sub/SubCreate';
import SubUpdate from './pages/admin/category/sub/SubUpdate';
import CreateProduct from './pages/admin/product/CreateProduct';
import AllProducts from './pages/admin/product/AllProducts';
import UpdateProduct from './pages/admin/product/UpdateProduct';
import ViewProduct from './pages/ViewProduct';
import CategoryHome from './pages/category/CategoryHome';
import SubCategoryHome from './pages/sub-category/SubCategoryHome';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import SideDrawer from './components/drawer/SideDrawer';
import CheckOut from './pages/CheckOut';
import CreateCoupon from './pages/admin/coupon/CreateCoupon';
import Payment from './pages/Payment';

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        // Accessing token
        const idTokenResult = await user.getIdTokenResult();
        // console.log('user', user, 'token', idTokenResult);

        currentUser(idTokenResult.token)
          .then(res => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                _id: res.data._id,
                token: idTokenResult.token
              }
            });
            console.log('payload sent from app');
          }).catch(err => {
            toast.error(err);
            console.log(err);
          });

      };
    });
    // cleanup function
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Fragment>

      <Header />
      <SideDrawer />
      <ToastContainer />

      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/register/complete">
          <CompleteRegistrationForm />
        </Route>
        <Route path="/forget/password">
          <ForgetPassword />
        </Route>
        <UserRoute path="/user/history">
          <History />
        </UserRoute>
        <UserRoute path="/user/password">
          <Password />
        </UserRoute>
        <UserRoute path="/user/wishlist">
          <Wishlist />
        </UserRoute>
        <AdminRoute path='/admin/dashboard'>
          <AdminDashboard />
        </AdminRoute>
        <AdminRoute exact path='/admin/category'>
          <CreateCategory />
        </AdminRoute>
        <AdminRoute path='/admin/category/:slug'>
          <UpdateCategory />
        </AdminRoute>
        <AdminRoute exact path='/admin/sub'>
          <SubCreate />
        </AdminRoute>
        <AdminRoute exact path='/admin/sub/:slug'>
          <SubUpdate />
        </AdminRoute>
        <AdminRoute exact path='/admin/product'>
          <CreateProduct />
        </AdminRoute>
        <AdminRoute path='/admin/products'>
          <AllProducts />
        </AdminRoute>
        <AdminRoute path='/admin/product/:slug'>
          <UpdateProduct />
        </AdminRoute>

        <Route path="/product/:slug" exact>
          <ViewProduct />
        </Route>
        <Route path="/category/:slug" >
          <CategoryHome />
        </Route>
        <Route path="/subs/:slug" >
          <SubCategoryHome />
        </Route>

        <Route path='/shop'>
          <Shop />
        </Route>

        <Route path='/cart'>
          <Cart />
        </Route>

        <UserRoute path='/checkout'>
          <CheckOut />
        </UserRoute>

        <AdminRoute path='/admin/coupon'>
          <CreateCoupon />
        </AdminRoute>

        <UserRoute path='/payment'>
          <Payment />
        </UserRoute>

      </Switch>
    </Fragment>
  );
}

export default App;
