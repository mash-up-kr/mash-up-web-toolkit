/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */


import instance from "@/configs/axios/instance";
import { ContentType, HttpClient, RequestParams } from "../@http-client";
import { UserType } from "../@types";

export class UserApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags user
   * @name CreateUsersWithListInput
   * @summary Creates list of users with given input array
   * @request POST:/user/createWithList
   */
  createUsersWithListInput = (variables: { body: UserType[]; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user/createWithList`,
      method: "POST",
      body: variables.body,
      type: ContentType.Json,
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags user
   * @name GetUserByName
   * @summary Get user by user name
   * @request GET:/user/{username}
   */
  getUserByName = (variables: { username: string; params?: RequestParams }) =>
    this.request<UserType, void>({
      path: `/user/${variables.username}`,
      method: "GET",
      format: "json",
      ...variables.params,
    });
  /**
   * @description This can only be done by the logged in user.
   *
   * @tags user
   * @name UpdateUser
   * @summary Updated user
   * @request PUT:/user/{username}
   */
  updateUser = (variables: { username: string; body: UserType; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user/${variables.username}`,
      method: "PUT",
      body: variables.body,
      type: ContentType.Json,
      ...variables.params,
    });
  /**
   * @description This can only be done by the logged in user.
   *
   * @tags user
   * @name DeleteUser
   * @summary Delete user
   * @request DELETE:/user/{username}
   */
  deleteUser = (variables: { username: string; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user/${variables.username}`,
      method: "DELETE",
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags user
   * @name LoginUser
   * @summary Logs user into the system
   * @request GET:/user/login
   */
  loginUser = (variables: {
    query: {
      /** The user name for login */
      username: string;
      /** The password for login in clear text */
      password: string;
    };
    params?: RequestParams;
  }) =>
    this.request<string, void>({
      path: `/user/login`,
      method: "GET",
      query: variables.query,
      format: "json",
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags user
   * @name LogoutUser
   * @summary Logs out current logged in user session
   * @request GET:/user/logout
   */
  logoutUser = (variables?: { params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user/logout`,
      method: "GET",
      ...variables?.params,
    });
  /**
   * No description
   *
   * @tags user
   * @name CreateUsersWithArrayInput
   * @summary Creates list of users with given input array
   * @request POST:/user/createWithArray
   */
  createUsersWithArrayInput = (variables: { body: UserType[]; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user/createWithArray`,
      method: "POST",
      body: variables.body,
      type: ContentType.Json,
      ...variables.params,
    });
  /**
   * @description This can only be done by the logged in user.
   *
   * @tags user
   * @name CreateUser
   * @summary Create user
   * @request POST:/user
   */
  createUser = (variables: { body: UserType; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/user`,
      method: "POST",
      body: variables.body,
      type: ContentType.Json,
      ...variables.params,
    });
}

export const userApi = new UserApi({ instance });
