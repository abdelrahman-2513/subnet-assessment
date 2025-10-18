using System.Net;

namespace backend.Helpers
{
    public static class SubnetValidator
    {
        public static bool IsValidCidr(string cidr)
        {
            if (string.IsNullOrWhiteSpace(cidr))
                return false;

            var parts = cidr.Split('/');
            if (parts.Length != 2)
                return false;

            // Validate IP part
            if (!IPAddress.TryParse(parts[0], out var _))
                return false;

            // Validate prefix part (must be between 0–32 for IPv4)
            if (!int.TryParse(parts[1], out int prefixLength))
                return false;

            return prefixLength >= 0 && prefixLength <= 32;
        }
    }
}
