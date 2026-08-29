import { Flex, FlexItem } from "@wordpress/components";
import AmountField from "../forms/fields/AmountField";
import InputField from "../forms/fields/InputField";
import UiCollection from "../ui/Collection";
import { __ } from "@wordpress/i18n";

export function SettingsLicensesForm({ licenseFields, appendLicense, removeLicense }: {
    licenseFields: any[];
    appendLicense: (license: { title: string; amount: string; age_min: string; age_max: string }) => void;
    removeLicense: (index: number) => void;
}) {
    return (
        <div>
            <h2 style={{ marginTop: 0 }}>{__("License prices", "wolf-membership")}</h2>
            <p style={{ color: "#646970", marginTop: 0 }}>
                {__("Set one line per license with its amount and age range.", "wolf-membership")}
            </p>

            <UiCollection
                items={licenseFields}
                onAddItem={() =>
                    appendLicense({
                        title: "",
                        amount: "",
                        age_min: "",
                        age_max: "",
                    })
                }
                onRemoveItem={(index) => removeLicense(index)}
                addLabel={__("Add a license", "wolf-membership")}
                emptyText={__("No license configured.", "wolf-membership")}
                renderItem={(_, index) => (
                    <div style={{ display: "grid", gap: 12 }}>
                        <InputField
                            name={`licenses.${index}.title`}
                            label={__("License title", "wolf-membership")}
                        />

                        <Flex gap={4}>
                            <FlexItem>
                                <AmountField
                                    name={`licenses.${index}.amount`}
                                    label={__("Price (EUR)", "wolf-membership")}
                                />
                            </FlexItem>
                            <FlexItem>
                                <InputField
                                    name={`licenses.${index}.age_min`}
                                    label={__("Min age", "wolf-membership")}
                                    type="number"
                                />
                            </FlexItem>
                            <FlexItem>
                                <InputField
                                    name={`licenses.${index}.age_max`}
                                    label={__("Max age", "wolf-membership")}
                                    type="number"
                                />
                            </FlexItem>
                        </Flex>
                    </div>
                )}
            />
        </div>
    );
}