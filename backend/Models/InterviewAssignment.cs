using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class InterviewAssignment
    {
        [Key] // Primary Key
        public int Id { get; set; }

        // Foreign Key to Interviewer
        [Required]
        [ForeignKey(nameof(Interviewer))] // navigation property name
        public int InterviewerId { get; set; }
        public Interviewer Interviewer { get; set; }

        // Foreign Key to Candidate
        [Required]
        [ForeignKey(nameof(Candidate))]
        public int CandidateId { get; set; }
        public Candidate Candidate { get; set; }

        // Interview Type (L1 / L2)
        [Required]
        [StringLength(10)]
        public string InterviewType { get; set; } = string.Empty;

        // Scheduled Date
        [Required]
        public DateTime ScheduledDate { get; set; }

        // Status: Pending / Accepted / Rejected / Cancelled
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";


        //NEW FIELD (Interviewer Workflow)
        public string InterviewerStatus { get; set; } = "Pending";
        // Pending / Accepted / Rejected

        // Optional remarks or notes
        [StringLength(255)]
        public string? Remarks { get; set; }

        // New fields
        public string MeetingId { get; set; } = string.Empty;    // GUID
        public string MeetingLink { get; set; } = string.Empty;  // frontend link

        // Offer Letter Acceptance Status
        // null = no response / offer not given
        // 1 = accepted
        // 0 = rejected
        public int? OfferStatus { get; set; } = null;

        // NEW → Offer Letter Send Status

        // Offer Letter Sent Status
        // 0 = not sent (default)dotnet ef migrations add AddOfferLetterSendField

        // 1 = sent
        public int OfferLetterSend { get; set; } = 0;

    }
}