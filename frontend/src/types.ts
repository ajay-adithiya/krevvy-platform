/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 'home' | 'products' | 'about' | 'contact' | 'faq';

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  rating: number;
  reviewsCount: number;
  image: string;
  primaryColorAccent: string;
  features: ProductFeature[];
  specifications: ProductSpec[];
  amazonUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'product' | 'warranty' | 'shipping' | 'general';
}

export interface FeedbackMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  newsletter: boolean;
}
