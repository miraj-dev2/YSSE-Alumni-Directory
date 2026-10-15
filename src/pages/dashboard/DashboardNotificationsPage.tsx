import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { portalApi } from '../../api/portalApi';
import { PortalNotification } from '../../types/portal';
import { useToast } from '../../context/ToastContext';

export const DashboardNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { refreshBadges } = useOutletContext<{ refreshBadges: () => void }>() || {};

  const [notes, setNotes] = useState<PortalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await portalApi.getNotifications();
      setNotes(res.items);
      setUnreadCount(res.unreadCount);
      refreshBadges?.();
    } catch (err: any) {
      error('Failed to load notifications', err.message);
    } finally {
      setLoading(false);
    }
  }, [error, refreshBadges]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await portalApi.markAllNotificationsRead();
      success('All Read', 'All notifications marked as read.');
      loadNotifications();
    } catch (err: any) {
      error('Failed to update', err.message);
    }
  };

  const handleNotificationClick = async (note: PortalNotification) => {
    if (!note.isRead) {
      portalApi.markNotificationRead(note.id).catch(() => {});
      setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      refreshBadges?.();
    }
    if (note.link) navigate(note.link);
  };

  const filtered = filterUnreadOnly ? notes.filter((n) => !n.isRead) : notes;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#EEF3E8]">Notifications</h1>
          <p className="text-xs text-[#9DB0A2]">Stay informed about session requests, approvals, and platform updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterUnreadOnly
                ? 'bg-[#B7FF72] text-[#18251D] border-[#B7FF72]'
                : 'border-[#2E4336] text-[#9DB0A2] hover:text-[#EEF3E8]'
            }`}
          >
            Unread Only ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary !h-8 text-xs font-semibold gap-1.5 inline-flex items-center"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-7 h-7 text-[#B7FF72] animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1F3027] border border-[#2E4336] rounded-2xl p-12 text-center text-xs text-[#9DB0A2] space-y-2">
          <Bell className="w-8 h-8 text-[#9DB0A2] mx-auto" />
          <p>No notifications to display.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => handleNotificationClick(note)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                note.isRead
                  ? 'bg-[#1F3027]/60 border-[#2E4336]/60 hover:bg-[#1F3027]'
                  : 'bg-[#1F3027] border-[#B7FF72]/40 hover:border-[#B7FF72]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!note.isRead && <span className="w-2 h-2 rounded-full bg-[#B7FF72]" />}
                  <h3 className="text-xs font-bold text-[#EEF3E8]">{note.title}</h3>
                  <span className="text-[10px] text-[#9DB0A2]">{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-[#9DB0A2]">{note.message}</p>
              </div>
              {note.link && (
                <ExternalLink className="w-3.5 h-3.5 text-[#9DB0A2] shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
