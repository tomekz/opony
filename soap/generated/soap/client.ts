import { Client as SClient, createClientAsync as soapCreateClientAsync } from "soap";
import { SearchOffersRequest } from "./definitions/SearchOffersRequest";
import { SearchOffersRequest1 } from "./definitions/SearchOffersRequest1";
import { MyOffersRequest } from "./definitions/MyOffersRequest";
import { MyOffersRequest1 } from "./definitions/MyOffersRequest1";
import { ShowOfferRequest } from "./definitions/ShowOfferRequest";
import { ShowOfferRequest1 } from "./definitions/ShowOfferRequest1";
import { NewOrderRequest } from "./definitions/NewOrderRequest";
import { NewOrderRequest1 } from "./definitions/NewOrderRequest1";
import { UpdateOrderRequest } from "./definitions/UpdateOrderRequest";
import { UpdateOrderRequest1 } from "./definitions/UpdateOrderRequest1";
import { ChangeOrderStatusRequest } from "./definitions/ChangeOrderStatusRequest";
import { ChangeOrderStatusRequest1 } from "./definitions/ChangeOrderStatusRequest1";
import { ImportOffersRequest1 } from "./definitions/ImportOffersRequest1";
import { ImportOffersRequest11 } from "./definitions/ImportOffersRequest11";
import { OrdersToRealizationRequest1 } from "./definitions/OrdersToRealizationRequest1";
import { OrdersToRealizationRequest11 } from "./definitions/OrdersToRealizationRequest11";
import { MyOrdersRequest1 } from "./definitions/MyOrdersRequest1";
import { MyOrdersRequest11 } from "./definitions/MyOrdersRequest11";
import { GetOrderRequest1 } from "./definitions/GetOrderRequest1";
import { GetOrderRequest11 } from "./definitions/GetOrderRequest11";
import { GetInvoicesRequest } from "./definitions/GetInvoicesRequest";
import { GetInvoicesRequest1 } from "./definitions/GetInvoicesRequest1";
import { AddInvoiceRequest } from "./definitions/AddInvoiceRequest";
import { AddInvoiceRequest1 } from "./definitions/AddInvoiceRequest1";
import { UpdateMyOfferRequest } from "./definitions/UpdateMyOfferRequest";
import { UpdateMyOfferRequest1 } from "./definitions/UpdateMyOfferRequest1";
import { PlatformaOponwebApi } from "./services/PlatformaOponwebApi";

export interface SoapClient extends SClient {
    PlatformaOponwebApi: PlatformaOponwebApi;
    searchOffersAsync(searchOffersRequest: SearchOffersRequest): Promise<[result: SearchOffersRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    myOffersAsync(myOffersRequest: MyOffersRequest): Promise<[result: MyOffersRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    showOfferAsync(showOfferRequest: ShowOfferRequest): Promise<[result: ShowOfferRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    newOrderAsync(newOrderRequest: NewOrderRequest): Promise<[result: NewOrderRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    updateOrderAsync(updateOrderRequest: UpdateOrderRequest): Promise<[result: UpdateOrderRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    changeOrderStatusAsync(changeOrderStatusRequest: ChangeOrderStatusRequest): Promise<[result: ChangeOrderStatusRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    importOffersAsync(importOffersRequest1: ImportOffersRequest1): Promise<[result: ImportOffersRequest11, rawResponse: any, soapHeader: any, rawRequest: any]>;
    ordersToRealizationAsync(ordersToRealizationRequest1: OrdersToRealizationRequest1): Promise<[result: OrdersToRealizationRequest11, rawResponse: any, soapHeader: any, rawRequest: any]>;
    myOrdersAsync(myOrdersRequest1: MyOrdersRequest1): Promise<[result: MyOrdersRequest11, rawResponse: any, soapHeader: any, rawRequest: any]>;
    getOrderAsync(getOrderRequest1: GetOrderRequest1): Promise<[result: GetOrderRequest11, rawResponse: any, soapHeader: any, rawRequest: any]>;
    getInvoicesAsync(getInvoicesRequest: GetInvoicesRequest): Promise<[result: GetInvoicesRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    addInvoiceAsync(addInvoiceRequest: AddInvoiceRequest): Promise<[result: AddInvoiceRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
    updateMyOfferAsync(updateMyOfferRequest: UpdateMyOfferRequest): Promise<[result: UpdateMyOfferRequest1, rawResponse: any, soapHeader: any, rawRequest: any]>;
}

/** Create SoapClient */
export function createClientAsync(...args: Parameters<typeof soapCreateClientAsync>): Promise<SoapClient> {
    return soapCreateClientAsync(args[0], args[1], args[2]) as any;
}
