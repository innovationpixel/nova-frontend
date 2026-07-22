import axios from 'axios';
// import swal from "sweetalert";
import Swal from "sweetalert2";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';
import { API_BASE_URL } from '../utils/config';

const getAccessToken = (tokenDetails = {}, storedToken = '') => {
    return (
        tokenDetails.access_token ||
        tokenDetails.accessToken ||
        tokenDetails.idToken ||
        storedToken ||
        ''
    );
};

const normalizeTokenDetails = (tokenDetails = {}, storedToken = '') => {
    const accessToken = getAccessToken(tokenDetails, storedToken);
    const expiresIn = tokenDetails.expiresIn ?? tokenDetails.expires_in ?? '';
    return {
        ...tokenDetails,
        access_token: tokenDetails.access_token || accessToken || '',
        idToken: tokenDetails.idToken || accessToken || '',
        expiresIn,
    };
};

export function signUp(email, password) {
    //axios call
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };
    return axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        postData,
    );
}

export function login(email, password) {
    const normalizedBaseUrl = API_BASE_URL.endsWith('/')
        ? API_BASE_URL
        : `${API_BASE_URL}/`;
    const endpoint = /\/admin(\/|$)/i.test(normalizedBaseUrl)
        ? 'login'
        : 'admin/login';
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // NOTE: CSRF handling temporarily disabled.
    return axios.post(`${normalizedBaseUrl}${endpoint}`, formData, {
        headers: {
            Accept: 'application/json',
        },
    });
}

export function formatError(errorResponse) {
    const errorsValue =
        errorResponse?.errors && typeof errorResponse.errors === 'object'
            ? Object.values(errorResponse.errors)[0]
            : null;
    const errorsMessage = Array.isArray(errorsValue) ? errorsValue[0] : errorsValue;
    const rawMessage =
        (typeof errorResponse?.message === 'string' && errorResponse.message) ||
        (typeof errorResponse?.error === 'string' && errorResponse.error) ||
        errorResponse?.error?.message ||
        (Array.isArray(errorResponse?.errors) && errorResponse.errors[0]) ||
        errorsMessage ||
        '';

    switch (rawMessage) {
        case 'EMAIL_EXISTS':
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email already exists',
            });
            return 'Email already exists';
        case 'EMAIL_NOT_FOUND':
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email not found',
            });
            return 'Email not found';
        case 'INVALID_PASSWORD':
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Invalid Password',
            });
            return 'Invalid Password';
        case 'USER_DISABLED':
            return 'User Disabled';
        default:
            return rawMessage || '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    const normalized = normalizeTokenDetails(tokenDetails);
    const expiresIn = normalized.expiresIn;
    const expireDate = expiresIn
        ? new Date(new Date().getTime() + Number(expiresIn) * 1000)
        : null;
    const storagePayload = {
        ...normalized,
        expireDate: expireDate ? expireDate.toISOString() : null,
    };

    localStorage.setItem('userDetails', JSON.stringify(storagePayload));

    if (normalized.access_token) {
        localStorage.setItem('access_token', normalized.access_token);
    }

    if (tokenDetails?.user) {
        localStorage.setItem('user', JSON.stringify(tokenDetails.user));
    }

    if (Array.isArray(tokenDetails?.user?.permissions)) {
        localStorage.setItem(
            'permissions',
            JSON.stringify(tokenDetails.user.permissions.map((p) => p.key)),
        );
    }

    if (tokenDetails?.user?.role_key !== undefined) {
        localStorage.setItem(
            'yobas_role',
            JSON.stringify(tokenDetails.user.role_key),
        );
    }

    if (expiresIn !== '' && expiresIn !== null && expiresIn !== undefined) {
        localStorage.setItem('expire', String(expiresIn));
    }

    return storagePayload;
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    const storedAccessToken = localStorage.getItem('access_token');
    let tokenDetails = {};

    if (!tokenDetailsString && !storedAccessToken) {
        dispatch(Logout(navigate));
        return;
    }

    if (tokenDetailsString) {
        try {
            tokenDetails = JSON.parse(tokenDetailsString);
        } catch (error) {
            tokenDetails = {};
        }
    }

    const normalized = normalizeTokenDetails(tokenDetails, storedAccessToken);
    const expireDate = normalized.expireDate
        ? new Date(normalized.expireDate)
        : null;
    const todaysDate = new Date();

    if (!normalized.idToken) {
        dispatch(Logout(navigate));
        return;
    }

    if (expireDate && todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }

    dispatch(loginConfirmedAction(normalized));

    if (expireDate) {
        const timer = expireDate.getTime() - todaysDate.getTime();
        runLogoutTimer(dispatch, timer, navigate);
    }
}
