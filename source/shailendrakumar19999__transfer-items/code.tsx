"use client";

import React, { useEffect, useState } from "react";
import { Switch, Transfer } from "antd";
import type { TransferProps } from "antd";

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

export const TransferItems = () => {
  const [oneWay, setOneWay] = useState(false);
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const newTargetKeys: string[] = [];
    const newMockData: RecordType[] = [];
    for (let i = 0; i < 50; i++) {
      const data = {
        key: i.toString(),
        title: `Item ${i + 1}`,
        description: `Description of item ${i + 1}`,
        chosen: i % 3 === 0,
      };
      if (data.chosen) {
        newTargetKeys.push(data.key);
      }
      newMockData.push(data);
    }
    setTargetKeys(newTargetKeys);
    setMockData(newMockData);
  }, []);

  const onChange: TransferProps["onChange"] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-6 rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          🔄 Transfer Items Example
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Two-way
          </span>
          <Switch
            unCheckedChildren="One Way"
            checkedChildren="One Way"
            checked={oneWay}
            onChange={setOneWay}
          />
        </div>
      </div>

      {/* Transfer */}
      <div className="rounded-xl  overflow-hidden p-4">
        <Transfer
          className="custom-transfer w-full mx-auto"
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={onChange}
          render={(item) => (
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 dark:text-gray-500">
                {item.title}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            </div>
          )}
          oneWay={oneWay}
          pagination
          listStyle={{
            width: 280,
            height: 350,
          }}
        />
      </div>
    </div>
  );
};
