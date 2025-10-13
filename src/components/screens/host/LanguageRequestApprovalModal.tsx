import React from 'react';
import { Language } from '../../../types';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';

interface LanguageRequestApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDeny: () => void;
  onApproveAll?: () => void;
  requestedLanguage: Language;
  requestingParticipant: {
    name: string;
    reason?: string;
  };
  estimatedCost: number;
  currentLanguageCount: number;
  tierLimit: number;
  isLoading?: boolean;
}

/**
 * Modal shown to host when participant requests additional language
 * Requires host approval and shows additional costs
 * 
 * Usage Example:
 * ```tsx
 * const { addLanguageToSession } = useSession();
 * 
 * const handleApprove = () => {
 *   // Add the approved language to the session for all participants
 *   addLanguageToSession(requestedLanguage.code);
 *   onClose();
 * };
 * 
 * <LanguageRequestApprovalModal
 *   onApprove={handleApprove}
 *   // ... other props
 * />
 * ```
 */
const LanguageRequestApprovalModal: React.FC<LanguageRequestApprovalModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onDeny,
  onApproveAll,
  requestedLanguage,
  requestingParticipant,
  estimatedCost,
  currentLanguageCount,
  tierLimit,
  isLoading = false
}) => {
  const overageCount = Math.max(0, currentLanguageCount - tierLimit + 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Language Request Approval
            </h2>
            <p className="text-sm text-gray-600">
              Participant requesting additional language beyond tier limits
            </p>
          </div>
        </div>

        {/* Requested Language */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Requested Language
          </h3>
          <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
            {/* flag removed */}
            <div>
              <p className="font-medium text-gray-900">{requestedLanguage.name}</p>
              <p className="text-sm text-gray-600">{requestedLanguage.native_name}</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Tier: {requestedLanguage.tier_required}
              </span>
            </div>
          </div>
        </div>

        {/* Requesting Participant */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-700 mb-3">
            Request Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {requestingParticipant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{requestingParticipant.name}</p>
                <p className="text-sm text-blue-600">Requesting participant</p>
              </div>
            </div>
            {requestingParticipant.reason && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm font-medium text-gray-700 mb-1">Reason provided:</p>
                <p className="text-sm text-gray-600 italic">"{requestingParticipant.reason}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Language Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Session Language Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current Languages:</span>
              <p className="font-semibold text-gray-900">{currentLanguageCount}</p>
            </div>
            <div>
              <span className="text-gray-600">Tier Limit:</span>
              <p className="font-semibold text-gray-900">{tierLimit}</p>
            </div>
            <div>
              <span className="text-gray-600">Overage Count:</span>
              <p className="font-semibold text-orange-600">{overageCount}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-semibold text-orange-600">
                {overageCount > 0 ? 'Over Limit' : 'Within Limit'}
              </p>
            </div>
          </div>
        </div>

        {/* Cost Impact */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-amber-400 mt-0.5 mr-3 text-lg">💰</span>
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                Overage Costs Apply
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                This language exceeds your tier limits and will incur additional charges.
              </p>
              <div className="mt-2 p-2 bg-amber-100 rounded text-sm">
                <p className="font-medium text-amber-800">
                  Estimated additional cost: ${estimatedCost.toFixed(2)}/hour
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  * Cost calculated based on current session duration and participant count
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Context */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Host Decision Options
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <div>
                <strong>Yes:</strong> Approve this specific language request only
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓✓</span>
              <div>
                <strong>Approve All:</strong> Approve this and all future language requests automatically
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">✗</span>
              <div>
                <strong>No:</strong> Deny this request - participant will be notified
              </div>
            </div>
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <strong>Billing Note:</strong> Costs apply only for actual usage minutes when participants actively use the additional language
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            onClick={onApprove}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            {isLoading ? 'Processing...' : 'Yes'}
          </Button>
          {onApproveAll && (
            <Button
              onClick={onApproveAll}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              Approve All
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onDeny}
            disabled={isLoading}
            size="sm"
          >
            No
          </Button>
        </div>

        {/* Cost Summary */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Cost:</strong> +${estimatedCost.toFixed(2)}/hour • <strong>Billing:</strong> Usage-based minutes only
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: You can disable language request permissions in future sessions 
            to prevent overage requests.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LanguageRequestApprovalModal;