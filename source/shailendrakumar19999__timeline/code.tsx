import { cn } from "@/lib/utils";
import { useState } from "react";
import React from 'react';
import { Timeline } from 'rsuite';
import CreditCardIcon from '@rsuite/icons/legacy/CreditCard';
import PlaneIcon from '@rsuite/icons/legacy/Plane';
import TruckIcon from '@rsuite/icons/legacy/Truck';
import UserIcon from '@rsuite/icons/legacy/User';
import CheckIcon from '@rsuite/icons/legacy/Check';

// Define types for timeline events
interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

// Icon mapping for common statuses
const TimelineIcons = {
  order: <CreditCardIcon />,
  transit: <PlaneIcon />,
  shipping: <TruckIcon />,
  delivery: <UserIcon />,
  completed: <CheckIcon style={{ background: '#15b215', color: '#fff' }} />,
};

// Order tracking timeline data
const orderEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: 'March 1, 10:20',
    title: 'Order Processing',
    description: 'Your order starts processing',
    icon: TimelineIcons.order,
  },
  {
    id: '2',
    timestamp: 'March 1, 11:34',
    title: 'Awaiting Pickup',
    description: 'The package waits for the company to pick up the goods',
  },
  {
    id: '3',
    timestamp: 'March 1, 16:20',
    title: 'Packed',
    description: 'Beijing company has received the shipment',
  },
  {
    id: '4',
    timestamp: 'March 2, 06:12',
    title: 'In Transit',
    description: 'Order has been shipped from Beijing to Shanghai',
    icon: TimelineIcons.transit,
  },
  {
    id: '5',
    timestamp: 'March 2, 09:20',
    title: 'In Transit',
    description: 'Sent from the Shanghai Container Center to the distribution center',
    icon: TimelineIcons.shipping,
  },
  {
    id: '6',
    timestamp: 'March 3, 14:20',
    title: 'Out for Delivery',
    description: 'Shanghai Hongkou District Company Deliverer: Mr. Li, currently sending you a shipment',
    icon: TimelineIcons.delivery,
  },
  {
    id: '7',
    timestamp: 'March 3, 17:50',
    title: 'Delivered',
    description: 'Your courier has arrived and the signer is the front desk',
    icon: TimelineIcons.completed,
  },
];

export const TimelineDemo = () => {
  return (
    <Timeline className="custom-timeline">
      {orderEvents.map((event) => (
        <Timeline.Item 
          key={event.id}
          dot={event.icon}
        >
          <p>{event.timestamp}</p>
          <p>{event.title}</p>
          {event.description && <p>{event.description}</p>}
        </Timeline.Item>
      ))}
    </Timeline>
  );
};