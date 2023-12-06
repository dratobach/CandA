import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export const getAllCustomers = (
  context: WebPartContext,
  siteUrl: string,
  field: string,
  direction: string
) => {
  return new Promise((resolve, reject) => {
    context.spHttpClient

      .get(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items?$orderBy=${field} ${direction}`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON) => {
          console.log(responseJSON);

          resolve(responseJSON.value);
        });
      });
  });
};

export const filterCustomers = (
  context: WebPartContext,
  siteUrl: string,
  search: string
) => {
  return new Promise((resolve, reject) => {
    context.spHttpClient

      .get(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items?$filter=substringof('${search}',CustomerName)`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON) => {
          console.log(responseJSON);

          resolve(responseJSON.value);
        });
      });
  });
};

export const checkUserAccess = (context: WebPartContext, siteUrl: string) => {
  return new Promise((resolve, reject) => {
    console.log("site url ", siteUrl);
    context.spHttpClient
      .get(
        `${siteUrl}/_api/web/sitegroups/getbyname('C and A Basic Edit')/CanCurrentUserViewMembership`,
        SPHttpClient.configurations.v1
      )
      .then((response) => {
        console.log("response ", response);
        resolve(response);
      });
  });
};

export const checkIsAdmin = (context: WebPartContext, siteUrl: string) => {
  return new Promise((resolve, reject) => {
    console.log("site url ", siteUrl);
    context.spHttpClient
      .get(
        `${siteUrl}/_api/web/sitegroups/getbyname('C and A Full Edit')/CanCurrentUserViewMembership`,
        SPHttpClient.configurations.v1
      )
      .then((response) => {
        console.log("response ", response);
        resolve(response);
      });
  });
};

export const addCustomer = (context: any, siteUrl: any, customer: any) => {
  console.log(customer);

  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        "Content-type": "application/json;odata=nometadata",
      },
      body: JSON.stringify({
        CustomerName: customer.CustomerName,
        TotalHours: customer.ContractHoursCredited,
        RemainingHours: customer.ContractHoursCredited,
      }),
    };
    context.spHttpClient
      .post(
        `${siteUrl}/_api/web/lists/getbytitle('C and A Management Customers')/items`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          console.log("error");
          resolve("error");
        } else {
          response.json().then((responseJSON) => {
            resolve(responseJSON.Id);
          });
        }
      });
  });
};

export const addNewCustomerHistory = (
  context: any,
  siteUrl: any,
  customerId: any,
  customer: any,
  status: any
) => {
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        "Content-type": "application/json;odata=nometadata",
      },
      body: JSON.stringify({
        Title: status,
        CustomerID: customerId,
        TrackDate: customer.TrackDate,
        ContractHoursCredited: customer.ContractHoursCredited,
        ContractID: customer.ContractID,
        HoursUsed: customer.HoursUsed,
        ZendeskRefID: customer.ZendeskRefID,
        RemedyRefID: customer.RemedyRefID,
      }),
    };
    context.spHttpClient
      .post(
        `${siteUrl}/_api/web/lists/getbytitle('C and A Management Customer History')/items`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          console.log("error");
          resolve("error");
        } else {
          response.json().then((responseJSON) => {
            resolve("ok");
          });
        }
      });
  });
};

export const getCustomerHistory = (
  context: WebPartContext,
  siteUrl: string,
  customerId: number,
  amount: number,
  field: string,
  direction: string
) => {
  return new Promise((resolve, reject) => {
    context.spHttpClient

      .get(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customer History')/Items?$filter=(CustomerID eq ${customerId})&$top=${amount}&$orderBy=${field} ${direction}`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON) => {
          console.log(responseJSON);

          resolve(responseJSON.value);
        });
      });
  });
};

export const updateCustomerTotalHours = (
  context: WebPartContext,
  siteUrl: string,
  customerId: number,
  totalHours: number,
  totalUsedHours: number,
  remainingHours: number
) => {
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "MERGE",
      },

      body: JSON.stringify({
        TotalHours: totalHours,
        RemainingHours: remainingHours,
        TotalUsedHours: totalUsedHours,
      }),
    };

    context.spHttpClient

      .post(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items(${customerId})`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        console.log("updated hours ", response);
        resolve(response);
      });
  });
};

export const updateCustomerName = (
  context: WebPartContext,
  siteUrl: string,
  customerId: number,
  customerName: string
) => {
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "MERGE",
      },

      body: JSON.stringify({
        CustomerName: customerName,
      }),
    };

    context.spHttpClient

      .post(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items(${customerId})`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        console.log("updated hours ", response);
        resolve(response.ok);
      });
  });
};

export const getCustomer = (
  context: WebPartContext,
  siteUrl: string,
  customerId: number
) => {
  return new Promise((resolve, reject) => {
    context.spHttpClient

      .get(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items?$filter=(ID eq ${customerId})`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON) => {
          console.log(responseJSON);

          resolve(responseJSON.value);
        });
      });
  });
};

export const editCustomerHistory = (
  context: WebPartContext,
  siteUrl: string,
  historyId: number,
  form: any
) => {
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "MERGE",
      },

      body: JSON.stringify({
        ContractID: form.ContractID,
        TrackDate: form.TrackDate,
        ContractHoursCredited: form.ContractHoursCredited,
      }),
    };

    context.spHttpClient

      .post(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customer History')/Items(${historyId})`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        console.log("updated hours ", response);
        resolve(response.ok);
      });
  });
};

export const deleteCustomer = (
  context: WebPartContext,
  siteUrl: string,
  customerId: number
) => {
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "DELETE",
      },
    };

    context.spHttpClient

      .post(
        `${siteUrl}/_api/web/lists/GetByTitle('C and A Management Customers')/Items(${customerId})`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        console.log("updated hours ", response);
        resolve(response.ok);
      });
  });
};

export const deleteCustomerHistory = (
  context: any,
  siteUrl: any,
  customerID: number
) => {
  return new Promise((resolve, reject) => {
    console.log("deleting all values for Customer : ", customerID);
    getCustomerHistory(
      context,
      siteUrl,
      customerID,
      10000,
      "Created",
      "asc"
    ).then((history: any) => {
      deleteHistory(context, siteUrl, history).then((resp) => {
        console.log("final response : ", resp);
        resolve(resp);
      });
    });
  });
};
export const deleteSingleHistory = (
  context: any,
  siteUrl: any,
  historyId: number
) => {
  console.log("deleting value");
  return new Promise((resolve, reject) => {
    const spOpts: ISPHttpClientOptions = {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
        "IF-MATCH": "*",
        "X-HTTP-Method": "DELETE",
      },
    };
    context.spHttpClient
      .post(
        `${siteUrl}/_api/web/lists/getbytitle('C and A Management Customer History')/items(${historyId})')`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        resolve(response);
      });
  });
};

async function deleteHistory(context: any, siteUrl: any, history: any) {
  console.log("deleting history  : ", history);
  let hasErrors = false;
  for (let index = 0; index < history.length; index++) {
    let retGroup = await deleteSingleHistory(
      context,
      siteUrl,
      history[index].Id
    ).then((resp: any) => {
      console.log("id is ", resp.ok);
      if (!resp.ok) {
        hasErrors = true;
      }
    });
    console.log(retGroup);
  }
  return hasErrors;
}
