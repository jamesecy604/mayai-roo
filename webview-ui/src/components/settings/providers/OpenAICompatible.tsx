import { useCallback } from "react"

import { Checkbox } from "vscrui"
import {  VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import { ReasoningEffort as ReasoningEffortType } from "@roo/schemas"
import { ProviderSettings,  openAiModelInfoSaneDefaults } from "@roo/shared/api"


import { useAppTranslation } from "@src/i18n/TranslationContext"


import { inputEventTransform } from "../transforms"

import { ReasoningEffort } from "../ReasoningEffort"

type OpenAICompatibleProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
}

export const OpenAICompatible = ({ apiConfiguration, setApiConfigurationField }: OpenAICompatibleProps) => {
	const { t } = useAppTranslation()

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = inputEventTransform,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	return (
		<>
			<VSCodeTextField
				value={apiConfiguration?.openAiBaseUrl || ""}
				type="url"
				onInput={handleInputChange("openAiBaseUrl")}
				placeholder={t("settings:placeholders.baseUrl")}
				className="w-full">
				<label className="block font-medium mb-1">{t("settings:providers.openAiBaseUrl")}</label>
			</VSCodeTextField>
			<VSCodeTextField
				value={apiConfiguration?.openAiApiKey || ""}
				type="password"
				onInput={handleInputChange("openAiApiKey")}
				placeholder={t("settings:placeholders.apiKey")}
				className="w-full">
				<label className="block font-medium mb-1">{t("settings:providers.openAiApiKey")}</label>
			</VSCodeTextField>
			<VSCodeTextField
				value={apiConfiguration?.openAiModelId || ""}
				onInput={handleInputChange("openAiModelId")}
				placeholder="Enter model ID (e.g. gpt-4o)"
				className="w-full">
				<label className="block font-medium mb-1">{t("settings:modelPicker.label")}</label>
			</VSCodeTextField>
	
			

			<div className="flex flex-col gap-1">
				<Checkbox
					checked={apiConfiguration.enableReasoningEffort ?? false}
					onChange={(checked: boolean) => {
						setApiConfigurationField("enableReasoningEffort", checked)

						if (!checked) {
							const { reasoningEffort: _, ...openAiCustomModelInfo } =
								apiConfiguration.openAiCustomModelInfo || openAiModelInfoSaneDefaults

							setApiConfigurationField("openAiCustomModelInfo", openAiCustomModelInfo)
						}
					}}>
					{t("settings:providers.setReasoningLevel")}
				</Checkbox>
				{!!apiConfiguration.enableReasoningEffort && (
					<ReasoningEffort
						apiConfiguration={{
							...apiConfiguration,
							reasoningEffort: apiConfiguration.openAiCustomModelInfo?.reasoningEffort,
						}}
						setApiConfigurationField={(field, value) => {
							if (field === "reasoningEffort") {
								const openAiCustomModelInfo =
									apiConfiguration.openAiCustomModelInfo || openAiModelInfoSaneDefaults

								setApiConfigurationField("openAiCustomModelInfo", {
									...openAiCustomModelInfo,
									reasoningEffort: value as ReasoningEffortType,
								})
							}
						}}
					/>
				)}
			</div>
			
		</>
	)
}
