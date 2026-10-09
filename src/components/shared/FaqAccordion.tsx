import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Who is eligible to join the YSSE Alumni Directory?',
    answer:
      'Any individual who completed an official fellowship, internship cohort, executive wing role, or project leadership position with Youth School for Social Entrepreneurs (YSSE) is eligible to register.',
  },
  {
    id: 'faq-2',
    question: 'How does the alumni approval process work?',
    answer:
      'When you register or submit changes to sensitive fields (e.g. current role or organization), the YSSE Secretariat verifies your cohort records before making your profile publicly visible. Review typically takes 24–48 hours.',
  },
  {
    id: 'faq-3',
    question: 'How do 1:1 mentorship sessions work?',
    answer:
      'Verified alumni can opt in to offer office hours on topics such as tech interview preparation, resume reviews, brand strategy, or social entrepreneurship. Members submit a topic and note, and the alumnus can accept or reschedule.',
  },
  {
    id: 'faq-4',
    question: 'Can I keep my email address and LinkedIn profile private?',
    answer:
      'Yes. You have granular privacy controls on your profile page (/me) to toggle email or LinkedIn visibility. Even when enabled, contact details are protected from unauthenticated web visitors.',
  },
  {
    id: 'faq-5',
    question: 'What is the difference between a Member account and an Alumni profile?',
    answer:
      'Current YSSE interns and students have Member accounts to explore mentors and request sessions. Alumni who have graduated have full Alumni profiles showcasing their career timelines and mentoring offerings.',
  },
];

export const FaqAccordion: React.FC = () => {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {FAQS.map((faq) => (
        <Accordion.Item
          key={faq.id}
          value={faq.id}
          className="bg-surface border border-border rounded-card overflow-hidden transition-colors"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="flex flex-1 items-center justify-between p-5 text-left text-sm font-semibold text-text hover:text-accent transition-colors group">
              <span>{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-accent transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 ml-3" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-5 pb-5 pt-1 text-sm text-muted leading-relaxed data-[state=open]:animate-fade-in">
            {faq.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
