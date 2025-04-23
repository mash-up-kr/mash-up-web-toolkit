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
import { ApiResponseType, PetType } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class PetApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pet
   * @name UploadFile
   * @summary uploads an image
   * @request POST:/pet/{petId}/uploadImage
   * @secure
   */
  uploadFile = (variables: {
    petId: number;
    data: {
      /** Additional data to pass to server */
      additionalMetadata?: string;
      /** file to upload */
      file?: File;
    };
    params?: RequestParams;
  }) =>
    this.request<ApiResponseType, any>({
      path: `/pet/${variables.petId}/uploadImage`,
      method: "POST",
      body: variables.data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags pet
   * @name AddPet
   * @summary Add a new pet to the store
   * @request POST:/pet
   * @secure
   */
  addPet = (variables: { body: PetType; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/pet`,
      method: "POST",
      body: variables.body,
      secure: true,
      type: ContentType.Json,
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags pet
   * @name UpdatePet
   * @summary Update an existing pet
   * @request PUT:/pet
   * @secure
   */
  updatePet = (variables: { body: PetType; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/pet`,
      method: "PUT",
      body: variables.body,
      secure: true,
      type: ContentType.Json,
      ...variables.params,
    });
  /**
   * @description Multiple status values can be provided with comma separated strings
   *
   * @tags pet
   * @name FindPetsByStatus
   * @summary Finds Pets by status
   * @request GET:/pet/findByStatus
   * @secure
   */
  findPetsByStatus = (variables: {
    query: {
      /** Status values that need to be considered for filter */
      status: ("available" | "pending" | "sold")[];
    };
    params?: RequestParams;
  }) =>
    this.request<PetType[], void>({
      path: `/pet/findByStatus`,
      method: "GET",
      query: variables.query,
      secure: true,
      format: "json",
      ...variables.params,
    });
  /**
   * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   *
   * @tags pet
   * @name FindPetsByTags
   * @summary Finds Pets by tags
   * @request GET:/pet/findByTags
   * @deprecated
   * @secure
   */
  findPetsByTags = (variables: {
    query: {
      /** Tags to filter by */
      tags: string[];
    };
    params?: RequestParams;
  }) =>
    this.request<PetType[], void>({
      path: `/pet/findByTags`,
      method: "GET",
      query: variables.query,
      secure: true,
      format: "json",
      ...variables.params,
    });
  /**
   * @description Returns a single pet
   *
   * @tags pet
   * @name GetPetById
   * @summary Find pet by ID
   * @request GET:/pet/{petId}
   * @secure
   */
  getPetById = (variables: { petId: number; params?: RequestParams }) =>
    this.request<PetType, void>({
      path: `/pet/${variables.petId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags pet
   * @name UpdatePetWithForm
   * @summary Updates a pet in the store with form data
   * @request POST:/pet/{petId}
   * @secure
   */
  updatePetWithForm = (variables: {
    petId: number;
    data: {
      /** Updated name of the pet */
      name?: string;
      /** Updated status of the pet */
      status?: string;
    };
    params?: RequestParams;
  }) =>
    this.request<any, void>({
      path: `/pet/${variables.petId}`,
      method: "POST",
      body: variables.data,
      secure: true,
      type: ContentType.FormData,
      ...variables.params,
    });
  /**
   * No description
   *
   * @tags pet
   * @name DeletePet
   * @summary Deletes a pet
   * @request DELETE:/pet/{petId}
   * @secure
   */
  deletePet = (variables: { petId: number; params?: RequestParams }) =>
    this.request<any, void>({
      path: `/pet/${variables.petId}`,
      method: "DELETE",
      secure: true,
      ...variables.params,
    });
}

export const petApi = new PetApi({ instance });
