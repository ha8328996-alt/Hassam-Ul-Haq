import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import {
  Send,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Mail,
  Smartphone,
  Globe,
  Radio,
} from 'lucide-react';
import { ChannelType } from '../../types';

export function ConversationsPage() {
  const { conversations, sendConversationMessage, resolveConversation } = useData();
  const { success } = useToast();
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id || '');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [replyText, setReplyText] = useState('');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const activeConversation = conversations.find((c) => c.id === selectedId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    if (channelFilter === 'all') return true;
    return c.channel === channelFilter;
  });

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-neutral-400" />;
      case 'slack':
        return <Radio className="w-3.5 h-3.5 text-emerald-500" />;
      case 'whatsapp':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'webchat':
        return <Globe className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;
    sendConversationMessage(activeConversation.id, replyText, isHumanMode ? 'human' : 'agent');
    setReplyText('');
    success('Message Dispatched', `Sent via ${activeConversation.channel.toUpperCase()}`);
  };

  const handleGenerateAIDraft = () => {
    if (!activeConversation) return;
    setIsGeneratingDraft(true);
    setTimeout(() => {
      setReplyText(
        `Hello ${activeConversation.customerName.split(' ')[0]}, thank you for reaching out. Our engineering team has reviewed the telemetry on your account and verified nominal routing.`
      );
      setIsGeneratingDraft(false);
      success('AI Draft Generated', 'Tailored contextual response prepared.');
    }, 500);
  };

  const handleResolve = () => {
    if (!activeConversation) return;
    resolveConversation(activeConversation.id);
    success('Thread Marked Resolved', `Closed conversation with ${activeConversation.customerName}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Unified Customer Conversations
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Omnichannel inbox aggregating Email, Slack, WhatsApp, and Webchat
          </p>
        </div>
        {/* Channel Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs overflow-x-auto">
          {['all', 'email', 'slack', 'whatsapp', 'webchat'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1 font-medium rounded-md transition-colors capitalize cursor-pointer ${
                channelFilter === ch
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split-Pane Inbox */}
      <Card className="p-0 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* Left Thread List (320px) */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/40 dark:bg-neutral-950/40">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Active Threads ({filteredConversations.length})
            </span>
            <span className="font-mono text-[10px]">Auto-Sync Active</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filteredConversations.map((c) => {
              const isSelected = c.id === activeConversation?.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3.5 text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-900 border-l-2 border-neutral-900 dark:border-white shadow-xs'
                      : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {getChannelIcon(c.channel)}
                      <span className="font-semibold text-neutral-900 dark:text-white truncate">
                        {c.customerName}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                      {c.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mb-2">{c.customerCompany}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                    {c.lastMessage}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px]">
                    <StatusIndicator status={c.status} />
                    <span className="font-mono text-neutral-400 uppercase">{c.channel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Message Thread */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {activeConversation.customerName}
                  </h3>
                  <span className="text-neutral-400">•</span>
                  <span className="text-xs text-neutral-500">{activeConversation.customerCompany}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                  <span>Assigned: {activeConversation.assignedAgent}</span>
                  <span>•</span>
                  <span>Sentiment: {activeConversation.sentiment}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResolve}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant={isHumanMode ? 'primary' : 'outline'}
                  onClick={() => setIsHumanMode(!isHumanMode)}
                  leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                >
                  {isHumanMode ? 'Human Active' : 'Take Over'}
                </Button>
              </div>
            </div>

            {/* Message History Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeConversation.messages.map((m) => {
                const isCustomer = m.sender === 'customer';
                const isHuman = m.sender === 'human';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col text-xs ${
                      isCustomer ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-[11px]">
                        {m.senderName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {m.timestamp}
                      </span>
                    </div>
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-xl leading-relaxed text-xs ${
                        isCustomer
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700/60'
                          : isHuman
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/40'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer Bar */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">
                  Sending as: <strong className="text-neutral-700 dark:text-neutral-200">{isHumanMode ? 'Human Operator' : activeConversation.assignedAgent}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleGenerateAIDraft}
                  disabled={isGeneratingDraft}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Draft</span>
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply via ${activeConversation.channel.toUpperCase()}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
                <Button type="submit" size="md" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-neutral-400 text-xs">
            Select a conversation thread to inspect messages.
          </div>
        )}
      </Card>
    </div>
  );
}
