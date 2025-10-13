import React from 'react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';

interface ParticipantQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDeny: () => void;
  pendingParticipant?: {
    name: string;
    email?: string;
  };
  currentCount: number;
  quotaLimit: number;
  costPerAdditionalParticipant: number;
  isLoading?: boolean;
}

/**
 * Modal shown to host when 101st participant tries to join
 * Requires host approval and shows additional costs
 */
const ParticipantQuotaModal: React.FC<ParticipantQuotaModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onDeny,
  pendingParticipant,
  currentCount,
  quotaLimit,
  costPerAdditionalParticipant,
  isLoading = false
}) => {
  const overageCount = Math.max(0, currentCount - quotaLimit + 1); // +1 for the pending participant

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Participant Quota Exceeded
            </h2>
            <p className="text-sm text-gray-600">
              Allow additional participant beyond {quotaLimit} limit?
            </p>
          </div>
        </div>

        {/* Participant Info */}
        {pendingParticipant && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Requesting to Join
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {pendingParticipant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{pendingParticipant.name}</p>
                {pendingParticipant.email && (
                  <p className="text-sm text-gray-600">{pendingParticipant.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-700 mb-3">
            Session Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Participants:</span>
              <p className="font-semibold text-gray-900">{currentCount}</p>
            </div>
            <div>
              <span className="text-gray-600">Quota Limit:</span>
              <p className="font-semibold text-gray-900">{quotaLimit}</p>
            </div>
            <div>
              <span className="text-gray-600">Overage Count:</span>
              <p className="font-semibold text-orange-600">{overageCount}</p>
            </div>
            <div>
              <span className="text-gray-600">Rate Increase:</span>
              <p className="font-semibold text-orange-600">+25%</p>
            </div>
          </div>
        </div>

        {/* Cost Warning */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-amber-400 mt-0.5 mr-3 text-lg">💰</span>
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                Additional Costs Apply
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Allowing participants beyond {quotaLimit} will trigger a 25% rate increase 
                for the entire session duration.
              </p>
              <div className="mt-2 p-2 bg-amber-100 rounded text-sm">
                <p className="font-medium text-amber-800">
                  Additional cost per participant: ${costPerAdditionalParticipant.toFixed(2)}/hour
                </p>
                <p className="text-amber-700">
                  Total overage cost: ${(overageCount * costPerAdditionalParticipant).toFixed(2)}/hour
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Context */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Host Decision Required
          </h4>
          <p className="text-sm text-gray-600">
            You enabled participant overage permissions in session setup. You can:
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• <strong>Approve:</strong> Allow participant to join with increased rates</li>
            <li>• <strong>Deny:</strong> Participant will see "Session Full" message</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onApprove}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Processing...' : 'Approve (+25% Rate)'}
          </Button>
          <Button
            variant="secondary"
            onClick={onDeny}
            disabled={isLoading}
          >
            Deny Access
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: You can disable participant overage permissions in future sessions 
            to automatically limit participants to {quotaLimit}.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ParticipantQuotaModal;