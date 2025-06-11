// src/data/mockSettings.ts

// IMPORTANT: Replace these with your actual icon file paths from your assets folder
import managePageIcon from '../assets/images/manageicon.png'; // Placeholder
import faqsIcon from '../assets/images/fiq.png';             // Placeholder
import referralsIcon from '../assets/images/referal.png';   // Placeholder
import aboutUsIcon from '../assets/images/aboutus.png';      // Placeholder
import footerIcon from '../assets/images/footericon.png';         // Placeholder
import socialIcon from '../assets/images/sociallinks.png';         // Placeholder
import testimonialIcon from '../assets/images/testimonials.png';// Placeholder
import commentIcon from '../assets/images/comments.png';       // Placeholder
import policyIcon from '../assets/images/terms.png';         // Placeholder
import contactIcon from '../assets/images/contactus.png';       // Placeholder

export interface SettingCardData {
  id: string;
  title: string;
  icon: string;
  type: 'primary' | 'secondary'; // primary = blue, secondary = orange
  hasMenu?: boolean;
}

export const settingsData: SettingCardData[] = [
  { id: 'manage', title: 'Manage page', icon: managePageIcon, type: 'primary', hasMenu: true },
  { id: 'faqs', title: 'FAQs', icon: faqsIcon, type: 'secondary' },
  { id: 'referrals', title: 'Manage Referrals', icon: referralsIcon, type: 'primary' },
  { id: 'about', title: 'About Us', icon: aboutUsIcon, type: 'secondary' },
  { id: 'footer', title: 'Footer', icon: footerIcon, type: 'primary' },
  { id: 'social', title: 'Social icons links', icon: socialIcon, type: 'secondary' },
  { id: 'testimonial', title: 'Testimonial', icon: testimonialIcon, type: 'primary' },
  { id: 'reviews', title: 'Reviews/Comment', icon: commentIcon, type: 'secondary' },
  { id: 'policy', title: 'Policy/ Terms & Condition', icon: policyIcon, type: 'primary' },
  { id: 'contact', title: 'Contact Us', icon: contactIcon, type: 'secondary' },
];