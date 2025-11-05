namespace VendeTuAutoYa.Api.Models
{
    public class MembershipInfo
    {
        public MembershipStatus Status { get; set; } = MembershipStatus.Free;
        public DateTime? ExpirationDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public bool AutoRenew { get; set; } = false;
    }
}