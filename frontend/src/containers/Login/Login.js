import React, {useEffect, useState} from 'react';
import {Avatar, Container, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import {clearErrorUser, loginUserRequest} from "../../store/actions/usersActions";
import FormElement from "../../components/Form/FormElement";
import {Link as RouterLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Alert} from "@material-ui/lab";
import ButtonWithProgress from "../../components/UI/AppToolbar/ButtonWithProgress/ButtonWithProgress";
import FacebookLogin from "../../components/UI/FacebookLogin/FacebookLogin";
import GoogleLogin from "../../components/UI/GoogleLogin/GoogleLogin";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.success.main,
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        marginTop: theme.spacing(3),
        width: "100%",
    },
}));

const Login = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const error = useSelector(state => state.users.loginError);
    const loginIn = useSelector(state => state.users.loginLoading);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            dispatch(clearErrorUser());
        };
    }, [dispatch]);

    const inputChangeHandler = e => {
        const {name, value} = e.target;

        setUser(prevState => ({...prevState, [name]: value}));
    };

    const submitFormHandler = e => {
        e.preventDefault();
        dispatch(loginUserRequest({...user}));
    };

    return (
        <Container component="section" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOpenOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h6">
                    Sign in
                </Typography>
                {
                    error &&
                    <Alert severity="error" className={classes.alert}>
                        {error.message || error.global}
                    </Alert>
                }
                <Grid
                    component="form"
                    container
                    className={classes.form}
                    onSubmit={submitFormHandler}
                    spacing={2}
                >
                    <FormElement
                        type="text"
                        autoComlete="current-email"
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={inputChangeHandler}
                    />

                    <FormElement
                        type="password"
                        autoComlete="current-username"
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={inputChangeHandler}
                    />

                    <Grid item xs={12}>
                        <ButtonWithProgress
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            loading={loginIn}
                            disabled={loginIn}
                        >
                            Sign in
                        </ButtonWithProgress>
                    </Grid>

                    <Grid item xs={12}>
                        <FacebookLogin/>
                    </Grid>

                    <Grid item xs={12}>
                        <GoogleLogin/>
                    </Grid>

                    <Grid item container justifyContent="flex-end">
                        <Link component={RouterLink} variant="body2" to="/register">
                            Or Sign up
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default Login;