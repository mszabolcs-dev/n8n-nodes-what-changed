import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WhatChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatChanged',
		name: 'whatChanged',
		group: ['transform'],
		version: 1,
		description: 'Detects changes in incoming content as a whole or in a specific field',
		defaults: {
			name: 'What Changed',
		},
		inputs: ['main'],
		/* eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong */
		outputs: ['main', 'main'],
		outputNames: ['true', 'false'],
		properties: [
			{
				displayName: 'Field Comparison Mode',
				name: 'watchField',
				type: 'boolean',
				default: false,
				description: "Whether to enable or disable watching for specific fields during comparison",
			},
			{
				displayName: 'Field to Compare',
				name: 'fieldToWatch',
				type: 'string',
				description: 'Type the name of the field you want to compare your data to',
				default: 'title',
				displayOptions: {
					show: {
						watchFields: [true],
					}
				}
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// working items
		const items = this.getInputData();
		const watchFields = this.getNodeParameter('watchField', 0) as boolean;
		const fieldToWatch = watchFields ? this.getNodeParameter('fieldToWatch', 0) as string : '';

		// static data storage
		const staticData = this.getWorkflowStaticData('global');
		const previousContent = (staticData.previousContent || []) as string[];
		const previousFieldValues = (staticData.previousFieldValues || {}) as { [key: string]: any };

		const outputTrue: INodeExecutionData[] = [];
		const outputFalse: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const currentItem = items[i].json;

			let hasChanged = false;

			// if watchFields and fieldToWatch is not empty, enter field comparison mode
			if (watchFields && fieldToWatch) {
				const currentFieldValue = currentItem[fieldToWatch];
				const previousFieldValue = previousFieldValues[fieldToWatch];

				// detect if previousFieldValue undefined (undefined = data changed) OR doesnt match prev execution
				hasChanged = previousFieldValue === undefined || currentFieldValue !== previousFieldValue;

				previousFieldValues[fieldToWatch] = currentFieldValue;

			} else {
				// else branch - entire JSON object comparison
				const currentContent = JSON.stringify(currentItem);
				const previousItemContent = previousContent[i] || null;

				hasChanged = previousItemContent === null || currentContent !== previousItemContent;

				if (hasChanged) {
					previousContent[i] = currentContent;
				}
			}

			// if hasChanged, output proper data
			if (hasChanged) {
				outputTrue.push({ json: currentItem });
			} else {
				outputFalse.push({ json: currentItem });
			}
		}

		// to avoid softlock, we update previousXXXX to the current one
		staticData.previousContent = previousContent;
		staticData.previousFieldValues = previousFieldValues;

		return [outputTrue, outputFalse];
	}
}
