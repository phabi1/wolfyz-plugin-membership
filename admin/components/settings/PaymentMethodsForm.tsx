import { Flex, FlexItem, Modal, Button } from "@wordpress/components";
import { useState, useEffect, useCallback, useMemo } from "react";
import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import InputField from "../forms/fields/InputField";
import UiCollection from "../ui/Collection";
import Form from "../forms/Form";
import SelectField from "../forms/fields/SelectField";
import DatePickerField from "../forms/fields/DatePickerField";

interface PaymentMethodForm {
    title: string;
    type: string;
    options: Record<string, any>;
}

export function SettingsPaymentMethodsForm({ paymentMethodFields, appendPaymentMethod, updatePaymentMethod, removePaymentMethod }: {
    paymentMethodFields: any[];
    appendPaymentMethod: (paymentMethod: { title: string; type: string; options: Record<string, any> }) => void;
    updatePaymentMethod: (index: number, paymentMethod: { title: string; type: string; options: Record<string, any> }) => void;
    removePaymentMethod: (index: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedPaymentMethodIndex !== null) {
            reset(paymentMethodFields[selectedPaymentMethodIndex]);
        }
        else {
            reset();
        }
    }, [selectedPaymentMethodIndex]);

    const form = useForm<PaymentMethodForm>({
        defaultValues: {
            title: "",
            type: "",
            options: {},
        },
    });

    const { register, reset, handleSubmit, watch, setValue } = form;

    const selectedType = watch("type");
    const modalTitle = useMemo(() => {
        if (selectedPaymentMethodIndex !== null) {
            return __("Edit Payment Method", "wolf-membership");
        }
        return __("Add Payment Method", "wolf-membership");
    }, [selectedPaymentMethodIndex]);

    useEffect(() => {
        if (selectedType) {
            setValue("options", {});
        }
    }, [selectedType]);

    const onSave = useCallback((data: PaymentMethodForm) => {
        if (selectedPaymentMethodIndex !== null) {
            updatePaymentMethod(selectedPaymentMethodIndex, data);
        }
        else {
            appendPaymentMethod(data);
        }
        setOpen(false);
    }, [selectedPaymentMethodIndex, appendPaymentMethod, updatePaymentMethod]);

    return (
        <>
            <div>
                <h2 style={{ marginTop: 0 }}>{__("Payment Methods", "wolf-membership")}</h2>
                <p style={{ color: "#646970", marginTop: 0 }}>
                    {__("Set one line per payment method with its amount and age range.", "wolf-membership")}
                </p>

                <UiCollection
                    items={paymentMethodFields}
                    onAddItem={() => {
                        setSelectedPaymentMethodIndex(null);
                        setOpen(true);
                    }}
                    onItemClicked={(index) => {
                        setSelectedPaymentMethodIndex(index);
                        setOpen(true);
                    }}
                    onRemoveItem={(index) => removePaymentMethod(index)}
                    addLabel={__("Add a payment method", "wolf-membership")}
                    emptyText={__("No payment method configured.", "wolf-membership")}
                    renderItem={(_, index) => (
                        <Flex>
                            <FlexItem>
                                {paymentMethodFields[index].title}
                            </FlexItem>
                            <FlexItem>
                                {paymentMethodFields[index].type}
                            </FlexItem>
                        </Flex>
                    )}
                />
            </div>
            {open && (
                <Modal
                    title={modalTitle}
                    onRequestClose={() => setOpen(false)}
                >
                    <Form form={form} onSubmit={handleSubmit(onSave)}>
                    <InputField
                        name="title"
                        label={__("Payment title", "wolf-membership")}
                        register={register}
                    />
                    <SelectField
                        name="type"
                        label={__("Payment type", "wolf-membership")}
                        register={register}
                        options={[
                            { value: "credit_card", label: __("Credit Card", "wolf-membership") },
                            { value: "credit_card_x", label: __("Credit Card X", "wolf-membership") },
                            { value: "bank_transfer", label: __("Bank Transfer", "wolf-membership") },
                            { value: "check", label: __("Check", "wolf-membership") }
                        ]}
                    ></SelectField>
                    {selectedType === "credit_card_x" && (
                        <UiCollection items={watch('options.periods') || []} onAddItem={() => form.setValue('options.periods', [...(watch('options.periods') || []), ''])} onRemoveItem={(index) => {
                            const updatedPeriods = [...(watch('options.periods') || [])];
                            updatedPeriods.splice(index, 1);
                            form.setValue('options.periods', updatedPeriods);
                        }} renderItem={(_, index) => (
                            <InputField
                                name={`options.periods[${index}]`}
                                label={__("Period", "wolf-membership")}
                                register={register}
                            />
                        )}></UiCollection>
                    )}
                    <Button type="submit">
                        {__("Save", "wolf-membership")}
                    </Button>
                </Form>
                </Modal >
            )
}
        </>
    );
}