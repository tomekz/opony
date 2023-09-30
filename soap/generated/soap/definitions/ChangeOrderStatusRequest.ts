
/** changeOrderStatusRequest */
export interface ChangeOrderStatusRequest {
    /** ComplexType are not supported yet */
    authorization?: any;
    /** xsd:int */
    orderId?: string;
    /** xsd:string */
    status?: string;
    /** xsd:string */
    comment?: string;
    /** xsd:string */
    deliveryDate?: string;
    /** xsd:string */
    wayBill?: string;
    /** xsd:string */
    courier?: string;
}
