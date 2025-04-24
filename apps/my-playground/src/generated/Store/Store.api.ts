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
import { OrderType } from "../@types";

export class StoreApi<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns a map of status codes to quantities
   *
   * @tags store
   * @name GetInventory
   * @summary Returns pet inventories by status
   * @request GET:/store/inventory
   * @secure
   */
  getInventory = (variables?: { params?: RequestParams }) =>
    this.request<Record<string, number>, any>({
      path: `/store/inventory`,
      method: "GET",
      secure: true,
      format: "json",
      ...variables?.params,
    });
  /**
   * No description
   *
   * @tags store
   * @name PlaceOrder
   * @summary Place an order for a pet
   * @request POST:/store/order
   */
  placeOrder = (variables: { body: OrderType; params?: RequestParams }) =>
    this.request<OrderType, void>({
      path: `/store/order`,
      method: "POST",
      body: variables.body,
      type: ContentType.Json,
      format: "json",
      ...variables.params,
    });
  /**
   * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   *
   * @tags store
   * @name GetOrderById
   * @summary Find purchase order by ID
   * @request GET:/store/order/{orderId}
   */
  getOrderById = (variables: { orderId: number; params?: RequestParams }) =>
    this.request<OrderType, void>({
      path: `/store/order/${variables.orderId}`,
      method: "GET",
      format: "json",
      ...variables.params,
    });
  /**
   * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   *
   * @tags store
   * @name DeleteOrder
   * @summary Delete purchase order by ID
   * @request DELETE:/store/order/{orderId}
   */
  deleteOrder = (variables: { orderId: number; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/store/order/${variables.orderId}`,
      method: "DELETE",
      ...variables.params,
    });
}

export const storeApi = new StoreApi({ instance });
