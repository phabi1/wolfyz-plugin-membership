import {
    Button,
    Card,
    CardBody,
    Flex,
    FlexItem,
    Spinner,
    TabPanel,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router";
import Form from "../../components/forms/Form";
import AmountField from "../../components/forms/fields/AmountField";
import InputField from "../../components/forms/fields/InputField";
import Page from "../../components/ui/Page";
import useToast from "../../hooks/use-toast";
import CampaignService from "../../services/campaigns";
import { convertDateToString, convertStringToDate, uuid } from "../../utils";
import DatePickerField from "../../components/forms/fields/DatePickerField";
import { SettingsPaymentMethodsForm } from "../../components/settings/PaymentMethodsForm";
import { SettingsLicensesForm } from "../../components/settings/LicensesForm";

type LicenseForm = {
    title: string;
    amount: string;
    age_min: string;
    age_max: string;
};

type PaymentMethodsForm = {
    id: string;
    title: string;
    type: string;
    options: Record<string, unknown>;
}

type SettingsFormValues = {
    title: string;
    registrationStart: string;
    registrationEnd: string;
    contributionAmount: number | null;
    contributionFamilyAmount: number | null;
    licenses: LicenseForm[];
    payment_methods: PaymentMethodsForm[];
};

function toDateInput(value: string): string {
    if (!value) {
        return "";
    }
    return value.slice(0, 10);
}

function normalizeLicenses(value: unknown, year: number): LicenseForm[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map((item) => {
        const license = item as Record<string, unknown>;
        return {
            title: String(license.title || ""),
            amount: String(license.amount ?? ""),
            age_min: String(license.year_min ? year - Number(license.year_min) : ""),
            age_max: String(license.year_max ? year - Number(license.year_max) : ""),
        };
    });
}

export default function CampaignSettingsPage() {
    const { campaignId } = useParams();
    const showToast = useToast();

    const currentYear = new Date().getFullYear();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const form = useForm<SettingsFormValues>({
        defaultValues: {
            title: "",
            registrationStart: "",
            registrationEnd: "",
            contributionAmount: null,
            contributionFamilyAmount: null,
            licenses: [],
            payment_methods: [],
        },
    });

    const { control, reset, handleSubmit } = form;

    const { fields: licenseFields, append: appendLicense, remove: removeLicense } = useFieldArray({
        control,
        name: "licenses",
    });

    const { fields: paymentMethodFields, append: appendPaymentMethod, update: updatePaymentMethod, remove: removePaymentMethod } = useFieldArray({
        control,
        name: "payment_methods",
    });

    useEffect(() => {
        if (!campaignId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        CampaignService.item(campaignId)
            .then((campaign) => {
                reset({
                    title: campaign.title || "",
                    registrationStart: toDateInput(convertDateToString(campaign.registration_start)),
                    registrationEnd: toDateInput(convertDateToString(campaign.registration_end)),
                    contributionAmount:
                        typeof campaign.settings["contribution_amount"] === "number"
                            ? (campaign.settings["contribution_amount"] as number)
                            : null,
                    contributionFamilyAmount:
                        typeof campaign.settings["contribution_family_amount"] === "number"
                            ? (campaign.settings["contribution_family_amount"] as number)
                            : null,
                    licenses: normalizeLicenses(campaign.settings?.licenses, currentYear),
                    payment_methods: Array.isArray(campaign.settings?.payment_methods)
                        ? campaign.settings?.payment_methods.map((method) => ({
                            id: method.id || uuid(),
                            title: String(method.title || ""),
                            type: String(method.type || ""),
                            options: method.options || {},
                        }))
                        : [],
                });
            })
            .catch(() => {
                showToast(__("Unable to load campaign settings.", "wolf-membership"), "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [campaignId, reset]);

    const canSave = useMemo(() => {
        return Boolean(campaignId) && !saving;
    }, [campaignId, saving]);

    const handleSave = async (values: SettingsFormValues) => {
        if (!campaignId) {
            return;
        }

        setSaving(true);

        try {
            await CampaignService.update(campaignId, {
                title: values.title,
                registration_start: convertStringToDate(values.registrationStart),
                registration_end: convertStringToDate(values.registrationEnd),
            });

            await CampaignService.updateSettings(campaignId, {
                contribution_amount: values.contributionAmount ?? 0,
                contribution_family_amount: values.contributionFamilyAmount ?? 0,
                licenses: values.licenses
                    .filter((item) => item.title.trim() !== "")
                    .map((item) => ({
                        title: item.title.trim(),
                        amount: Number(item.amount || 0),
                        year_min: item.age_min === "" ? null : currentYear - Number(item.age_min),
                        year_max: item.age_max === "" ? null : currentYear - Number(item.age_max),
                    })),
                payment_methods: values.payment_methods
                    .filter((item) => item.title.trim() !== "")
                    .map((item) => ({
                        id: item.id || uuid(),
                        title: item.title.trim(),
                        type: item.type,
                        options: item.options || {},
                    })),
            });

            showToast(__("Campaign settings saved.", "wolf-membership"), "success");
        } catch (error) {
            showToast(__("Unable to save campaign settings.", "wolf-membership"), "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <Form form={form} onSubmit={handleSave}>
            <Page title={__("Campaign Settings", "wolf-membership")} headerRight={
                <Button
                    variant="primary"
                    disabled={!canSave}
                    isBusy={saving}
                    type="submit"
                >
                    {saving ? __("Saving...", "wolf-membership") : __("Save settings", "wolf-membership")}
                </Button>
            }>
                <TabPanel
                    className="my-tab-panel"
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: "general",
                            title: __("General", "wolf-membership"),
                            className: "general-tab",
                        },
                        {
                            name: "licenses",
                            title: __("Licenses", "wolf-membership"),
                            className: "licenses-tab",
                        },
                        {
                            name: "payments",
                            title: __("Payments", "wolf-membership"),
                            className: "payments-tab",
                        },
                    ]}
                >
                    {(tab) => {
                        switch (tab.name) {
                            case "general":
                                return (
                                    <>
                                        <Card>
                                            <CardBody>
                                                <div style={{ display: "grid", gap: 16 }}>
                                                    <InputField
                                                        name="title"
                                                        label={__("Campaign title", "wolf-membership")}
                                                    />

                                                    <Flex align="start" gap={4}>
                                                        <FlexItem>
                                                            <DatePickerField
                                                                name="registrationStart"
                                                                label={__("Registration start", "wolf-membership")}
                                                            />
                                                        </FlexItem>

                                                        <FlexItem>
                                                            <DatePickerField
                                                                name="registrationEnd"
                                                                label={__("Registration end", "wolf-membership")}
                                                            />
                                                        </FlexItem>
                                                    </Flex>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardBody>
                                                <Flex align="start" gap={4}>
                                                    <FlexItem>
                                                        <AmountField
                                                            name="contributionAmount"
                                                            label={__("Registration amount (EUR)", "wolf-membership")}
                                                        />
                                                    </FlexItem>
                                                    <FlexItem>
                                                        <AmountField
                                                            name="contributionFamilyAmount"
                                                            label={__("Family registration amount (EUR)", "wolf-membership")}
                                                        />
                                                    </FlexItem>
                                                </Flex>

                                            </CardBody>
                                        </Card>
                                    </>
                                );
                            case "payments":
                                return (
                                    <Card>
                                        <CardBody>
                                            <SettingsPaymentMethodsForm
                                                paymentMethodFields={paymentMethodFields}
                                                appendPaymentMethod={appendPaymentMethod}
                                                updatePaymentMethod={updatePaymentMethod}
                                                removePaymentMethod={removePaymentMethod}
                                            />
                                        </CardBody>
                                    </Card>
                                );
                            case "licenses":
                                return (
                                    <Card>
                                        <CardBody>
                                            <SettingsLicensesForm
                                                licenseFields={licenseFields}
                                                appendLicense={appendLicense}
                                                removeLicense={removeLicense}
                                            />
                                        </CardBody>
                                    </Card>
                                );
                            default:
                                return null;
                        }
                    }}
                </TabPanel>
            </Page>
        </Form>
    );
}
