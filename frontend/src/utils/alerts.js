import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Standard confirmation dialog for the application.
 * Matches the premium glassmorphic aesthetic.
 */
export const confirmAction = async ({ 
  title = 'Are you sure?', 
  text = '', 
  icon = 'warning',
  confirmButtonText = 'Yes, Proceed',
  cancelButtonText = 'No, Cancel',
  danger = false
}) => {
  const result = await MySwal.fire({
    title: `<span style="font-size: 1.25rem; font-weight: 700;">${title}</span>`,
    html: text ? `<p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">${text}</p>` : '',
    icon: icon,
    iconColor: danger ? 'var(--error)' : 'var(--primary)',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    buttonsStyling: false,
    background: 'var(--panel-bg)',
    color: 'var(--text-main)',
    width: '380px',
    padding: '2rem',
    backdrop: `rgba(0,0,0,0.4)`,
    customClass: {
      popup: 'glass-card',
      confirmButton: 'btn-primary',
      cancelButton: 'btn-secondary',
      actions: 'swal-actions-custom'
    },
    // Ensure the confirm button matches the danger intent if specified
    didOpen: () => {
      if (danger) {
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
          confirmBtn.style.backgroundColor = 'var(--error)';
        }
      }
    }
  });

  return result.isConfirmed;
};
