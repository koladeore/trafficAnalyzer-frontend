import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../actions/authentication';
import { decodeToken} from '../../helper/security';



const LoginPage = () => {
  const history = useHistory();
  const getUser = JSON.parse(localStorage.getItem('EmpowerFarmerUser'));
  if (getUser) {
    history.push('/sponsorDashboard');
  }
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			customCheck1: false
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Invalid email address format')
				.required('Email is required'),
			password: Yup.string()
				.required('Password is required')
				.min(6, 'password must be minimum of 6 characters'),
			customCheck1: Yup.boolean()
				.oneOf([true], '')
		}),
		onSubmit: async (values, { setSubmitting }) => {
			const loginData = await loginUser(values);
			const { status, message, data } = loginData;
			console.log('user', loginData, data.userType)

      if (status === 200) {
				localStorage.setItem('adminOrWarden', JSON.stringify(loginData));
				// setTimeout(() => alert('User have successfully loggedIn '), 2000)
				data.userType === 'admin' ? history.push('/adminDashboard') : history.push('/wardenDashboard')
				setTimeout(() => {
					setError(true);
					setAlertMessage(message);
					setSubmitting(false);
				}, 401);
			}
		}
	});

  return (
        <div>
          <div className="container wrapper">
            <div className="row no-gutter wrapper">
              <div className="d-none d-md-flex col-md-6 bg-image">
              </div>
              <div className="col-md-6">
                <div className="login d-flex align-items-center py-5">
                  <div className="container">
                    <div className="row">
                       <div className="col-md-9 col-lg-8 mx-auto">
                         <h2 className="login-heading mb-4 text-center">Log in to your account</h2>
                         { error ? <div className="error">{alertMessage} </div> : '' }
                           <form onSubmit = {formik.handleSubmit}>
                                <div className="form-label-group">
												<input
																	 type="email"
                                    id="inputEmail"
                                    className="form-control"
                                    placeholder="Email address"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email
                                  ? (<div className ='input-error mt-1 pl-3'>{formik.errors.email}</div>) : null
                                }
                                <label htmlFor="inputemail">email address</label>
                                </div>

                                <div className="form-label-group">
                                    <input
                                        type="password"
                                        id="inputPassword"
                                        className="form-control"
                                        placeholder="Password"
                                        {...formik.getFieldProps('password')}
                                    />
                                    {formik.touched.password && formik.errors.password
                                      ? (<div className ='input-error mt-1 pl-3'>{formik.errors.password}</div>) : null
                                    }
                                    <label htmlFor="inputPassword">Password</label>
                                </div>

                                <div className="custom-control custom-checkbox mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="customCheck1"
                                        {...formik.getFieldProps('customCheck1')}
                                 />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
                                </div>
                                <button className="btn btn-success btn-block btn-login mb-2" type="submit"
                                >Login</button>
                                <div className="form-group col-lg-12 mx-auto d-flex align-items-center my-3">
                                <div className="border-bottom w-100 ml-5"></div>
                                    <span className="px-2 small font-weight-bold text-muted">OR</span>
                                    <div className="border-bottom w-100 mr-5"></div>
                                </div>
                                <div className="text-center">
                                  <a className="small" href="/forgot-password">Forgot password?</a>
                                </div>
                            </form>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
         </div>
        </div>
  );
};

export default LoginPage;
