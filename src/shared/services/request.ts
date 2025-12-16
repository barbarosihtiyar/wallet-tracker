import { GeneralModalFunction } from "@/components";

import { languageVariants } from "../constants";
import i18n from "../i18n";
import { buildPaginationQuery } from "../lib/pagination";
import { ApiResponse, LangKey, RequestOptions } from "../types/HttpTypes";

function parseData(data: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" || value instanceof Blob) {
      formData.append(key, value);
    }
  }
  return formData;
}

async function request(
  url: string,
  data: Record<string, unknown> | false = false,
  method: string = "GET",
  type: "JSON" | "FORM_DATA" = "JSON",
  dontSendToken: boolean = false,
): Promise<ApiResponse | undefined> {
  const token = localStorage.getItem("token");
  const selectedLang = localStorage.getItem("i18nextLng");
  const langKey: LangKey = (selectedLang ?? "en") as LangKey;

  const headers: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": languageVariants[langKey] || "tr-TR",
  };

  if (!dontSendToken && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestOptions = {
    method,
    headers,
  };

  if (
    data &&
    (method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE")
  ) {
    if (type === "JSON") {
      options.body = JSON.stringify(data);
    } else {
      options.body = parseData(data);
      delete headers["Content-Type"];
    }
  }

  const response = await fetch(process.env.PUBLIC_URL + url, options);
  const result = (await response?.json()) as ApiResponse;

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  } else if (response.ok) {
    if (result?.errorMessage) {
      GeneralModalFunction(
        "warning",
        result.errorMessage,
        i18n.t("general.error.title"),
      );
    }

    return result;
  } else {
    GeneralModalFunction(
      "warning",
      result?.errorMessage || i18n.t("general.error.desc"),
      i18n.t("general.error.title"),
    );

    const error: Error & { response?: ApiResponse } = new Error(
      result?.errorMessage || "Request failed",
    );

    throw error;
  }
}

export const postFormData = (url: string, data: Record<string, unknown>) =>
  request(url, data, "POST", "FORM_DATA");

export const get = (url: string) => request(url);

export const getWithParams = (url: string, params: Record<string, unknown>) => {
  const queryString = buildPaginationQuery(params);
  const finalUrl = url + queryString;
  return request(finalUrl);
};

export const post = (url: string, data: Record<string, unknown>) =>
  request(url, data, "POST");

export const put = (url: string, data: Record<string, unknown>) =>
  request(url, data, "PUT");

export const patch = (url: string, data: Record<string, unknown>) =>
  request(url, data, "PATCH");

export const deleted = (url: string, data: Record<string, unknown>) =>
  request(url, data, "DELETE");
