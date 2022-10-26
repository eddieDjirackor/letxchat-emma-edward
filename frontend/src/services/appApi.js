import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001",
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout

        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        // Edit profile
        editUser: builder.mutation({
            query: ({id, ...payload}) => ({
                url: `/users/profile/${id}`,
                method: 'PUT',
                body: payload,
            })
        }),
        resetUser: builder.mutation({
            query: ({id, ...payload}) => ({
                url: `/users/reset/${id}`,
                method: 'PUT',
                body: payload,
            })
        }),
        forgotUser: builder.mutation({
            query: ({...payload}) => ({
                url: '/users/reset/',
                method: 'PUT',
                body: payload,
            })
        }),
    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useEditUserMutation, useResetUserMutation, useForgotUserMutation } = appApi;

export default appApi;
