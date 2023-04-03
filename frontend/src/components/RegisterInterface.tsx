import { Formik } from 'formik';
import { useFormik } from 'formik';
import * as Yup from "yup";

function RegisterInterface() {
    const loginSchema = Yup.object().shape({
        email: Yup.string().email().required("You must provide en e-mail address"),
        name: Yup.string().required("You must provide a name"),
        password: Yup.string().required("You must provide a password"),
        confirmPassword: Yup.string().required("You must confirm the password").oneOf([Yup.ref('password')], 'Passwords must match')
    });

    const formik = useFormik({
        initialValues: {email: '', name: '', password: '', confirmPassword: ''},
        validationSchema: loginSchema,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="bg-blue-500 bg-fixed w-screen h-screen bg-center bg-cover flex items-center justify-center shadow-md">
                <div className="bg-white w-fit h-fit margin-10 flex items-center justify-center flex-col rounded gap-2 py-6 px-10">
                    <h3 className="text-2xl font-normal font-sans">Register</h3>
                    <div>
                        <label className="text-xs font-light font-sans">E-mail</label><br/>
                        <input type="email" name="email" placeholder="name@email.com" value={formik.values.email} onChange={formik.handleChange} className="font-light text-base rounded border border-neutral-400 font-sans p-1"/>
                        <div className="text-xs font-light font-sans text-red-500">{formik.errors.email && formik.touched.email ? formik.errors.email: null}</div>
                    </div>
                    <div>
                        <label className="text-xs font-light font-sans">Name</label><br/>
                        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} className="font-light text-base rounded border border-neutral-400 font-sans p-1"/>
                        <div className="text-xs font-light font-sans text-red-500">{formik.errors.name && formik.touched.name ? formik.errors.name: null}</div>
                    </div>
                    <div>
                        <label className="text-xs font-light font-sans">Password</label><br/>
                        <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} className="font-light text-base rounded border border-neutral-400 font-sans p-1"/>
                        <div className="text-xs font-light font-sans text-red-500">{formik.errors.password && formik.touched.password ? formik.errors.password : null}</div>
                    </div>
                    <div>
                        <label className="text-xs font-light font-sans">Confirm password</label><br/>
                        <input type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} className="font-light text-base rounded border border-neutral-400 font-sans p-1"/>
                        <div className="text-xs font-light font-sans text-red-500">{formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : null}</div>
                    </div>
                    <button className="text-white font-sans font-light bg-blue-700 rounded focus:shadow-inner padding-300 py-1 px-2 mt-5" disabled={formik.isSubmitting}>Register</button>
                    <button className="bg-white font-sans margin-10 rounded focus:shadow-inner py-1 px-2">Already have an account?</button>
                </div>
            </div>
        </form>
    );
}

export default RegisterInterface