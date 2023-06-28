import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { OrderDto } from '@up/data';
import {
  CheckoutOrderFeature,
  CheckoutOrderSelectors
} from '@up/web-checkout-state';
import { Observable } from 'rxjs';
import {
  MerchantDiscountTypeActions,
  MerchantDiscountTypeSelectors,
  MerchantsFeature
} from '@up/web-merchant-state';

@Component({
  templateUrl: './voucher-code-dialog.component.html',
  styleUrls: ['./voucher-code-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CustomerLoyaltyDialogComponent {
  voucherDiscount$: Observable<any>;
  public checkoutOrders$: Observable<OrderDto[]>;
  searching$: Observable<boolean>;

  constructor(
    private merchantsStore: Store<MerchantsFeature.MerchantsPartialState>,
    private checkoutStore: Store<CheckoutOrderFeature.CheckoutPartialState>
  ) {
    this.voucherDiscount$ = this.merchantsStore.pipe(
      select(MerchantDiscountTypeSelectors.getVoucherDiscount)
    );

    this.checkoutOrders$ = this.checkoutStore.pipe(
      select(CheckoutOrderSelectors.getAllCheckout)
    );

    this.searching$ = this.merchantsStore.pipe(
      select(MerchantDiscountTypeSelectors.getVoucherCodeLoaded)
    );
  }

  onSearch([voucherCode]) {
    this.merchantsStore.dispatch(
      MerchantDiscountTypeActions.searchVoucherCode({ voucherCode })
    );
  }

  onSelectCustomerLoyalty(
    {
      customerId,
      loyaltyPoints,
      customerName
    }: {
      customerId: number;
      loyaltyPoints: number;
      customerName: string;
    },
    orders: OrderDto[]
  ) {
    // const totalDiscount = this.customerLoyaltyService.calculateCustomerLoyaltyDiscount(
    //   {
    //     customerId,
    //     loyaltyPoints
    //   },
    //   orders
    // );
    // localStorage.setItem('_customerId', customerId.toString());
    // this.store.dispatch(
    //   WebPosCustomerLoyaltyActions.selectCustomerLoyalty({
    //     fromState: false,
    //     customerId,
    //     loyaltyPoints,
    //     customerName,
    //     totalDiscount: totalDiscount.totalCustomerLoyaltyDiscount,
    //     productsInAlgorithm: totalDiscount
    //   })
    // );
  }

  onDismiss() {
    // localStorage.removeItem('_customerId');
    // this.store.dispatch(
    //   WebPosCustomerLoyaltyActions.dismissCustomerLoyaltySearchPopup()
    // );
  }
}
