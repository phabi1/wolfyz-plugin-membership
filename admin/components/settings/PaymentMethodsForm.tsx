import { Flex, FlexItem, Modal, Button } from "@wordpress/components";
import { useState, useEffect, useCallback, useMemo } from "react";
import { __ } from "@wordpress/i18n";
import { useForm } from "react-hook-form";
import InputField from "../forms/fields/InputField";
import UiCollection from "../ui/Collection";
import Form from "../forms/Form";
import SelectField from "../forms/fields/SelectField";
import { uuid } from "../../utils";
import { CreditCardXOptions } from "./payments/CreditCardXOptions";

interface PaymentMethodForm {
    id: string;
    title: string;
    type: string;
    options: Record<string, any>;
}

export function SettingsPaymentMethodsForm({ items, onAdd, onUpdate, onRemove }: {
    items: PaymentMethodForm[];
    onAdd: (data: PaymentMethodForm) => void;
    onUpdate: (index: number, data: PaymentMethodForm) => void;
    onRemove: (index: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedItem = useMemo(() => {
        if (selectedIndex !== null) {
            return items[selectedIndex];
        }
        return null;
    }, [selectedIndex, items]);

    const modalTitle = useMemo(() => {
        if (selectedIndex !== null) {
            return __("Edit Payment Method", "wolf-membership");
        }
        return __("Add Payment Method", "wolf-membership");
    }, [selectedIndex]);

    const form = useForm<PaymentMethodForm>({
        defaultValues: {
            id: uuid(),
            title: "",
            type: "",
            options: {},
        },
    });

    const { reset, watch, setValue } = form;

    const selectedType = watch("type");

    const onSave = (data: PaymentMethodForm) => {
        console.log(data);
        if (selectedIndex !== null) {
            onUpdate(selectedIndex, JSON.parse(JSON.stringify(data)));
        }
        else {
            onAdd(data);
        }
        setOpen(false);
    };

    const handleModalClose = useCallback(() => {
        setOpen(false);
        setSelectedIndex(null);
    }, [open, selectedIndex]);

    useEffect(() => {
        if (selectedItem !== null && selectedItem.type === selectedType) {
            setValue("options", selectedItem.options);
        } else {
            setValue("options", {});
        }
    }, [selectedItem, selectedType]);

    useEffect(() => {
        if (selectedIndex !== null) {
            reset(items[selectedIndex]);
        }
        else {
            reset({
                id: uuid(),
                title: "",
                type: "",
                options: {},
            });
        }
    }, [selectedIndex]);



    return (
        <>
            <div>
                <h2 style={{ marginTop: 0 }}>{__("Payment Methods", "wolf-membership")}</h2>
                <p style={{ color: "#646970", marginTop: 0 }}>
                    {__("Set one line per payment method with its amount and age range.", "wolf-membership")}
                </p>

                <UiCollection
                    items={items}
                    onAddItem={() => {
                        setSelectedIndex(null);
                        setOpen(true);
                    }}
                    onItemClicked={(index) => {
                        setSelectedIndex(index);
                        setOpen(true);
                    }}
                    onRemoveItem={(index) => onRemove(index)}
                    addLabel={__("Add a payment method", "wolf-membership")}
                    emptyText={__("No payment method configured.", "wolf-membership")}
                    renderItem={(_, index) => (
                        <Flex>
                            <FlexItem>
                                {items[index].title}
                            </FlexItem>
                            <FlexItem>
                                {items[index].type}
                            </FlexItem>
                        </Flex>
                    )}
                />
            </div>
            {open && (
                <Modal
                    title={modalTitle}
                    onRequestClose={handleModalClose}
                >
                    <Form form={form} onSubmit={onSave}>
                        <InputField
                            name="title"
                            label={__("Payment title", "wolf-membership")}
                        />
                        <SelectField
                            name="type"
                            label={__("Payment type", "wolf-membership")}
                            options={[
                                { value: "credit_card", label: __("Credit Card", "wolf-membership") },
                                { value: "credit_card_x", label: __("Credit Card X", "wolf-membership") },
                                { value: "bank_transfer", label: __("Bank Transfer", "wolf-membership") },
                                { value: "check", label: __("Check", "wolf-membership") }
                            ]}
                        ></SelectField>
                        {selectedType === "credit_card_x" && (
                            <CreditCardXOptions
                                value={watch('options') || { periods: [] }}
                                onChange={(newValue) => form.setValue('options', newValue)}
                            />
                        )}
                        <Button type="submit" variant="primary">
                            {__("Save", "wolf-membership")}
                        </Button>
                    </Form>
                </Modal >
            )
            }
        </>
    );
}