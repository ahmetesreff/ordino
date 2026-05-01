import { Module } from '@nestjs/common';
import { MockPaymentProvider, PaymentService, PAYMENT_PROVIDER } from './payment.service';

@Module({
    providers: [
        MockPaymentProvider,
        {
            provide: PAYMENT_PROVIDER,
            useExisting: MockPaymentProvider,
        },
        PaymentService,
    ],
    exports: [PaymentService],
})
export class PaymentModule { }
