using System.Net;

namespace backend.Configs
{
    public static class SubnetHelper
    {
        public static List<string> GenerateIpsFromCidr(string cidr)
        {
            var parts = cidr.Split('/');
            var baseIp = parts[0];
            var prefix = int.Parse(parts[1]);

            var baseAddress = BitConverter.ToUInt32(IPAddress.Parse(baseIp).GetAddressBytes().Reverse().ToArray());
            int hostBits = 32 - prefix;
            int numberOfIps = (int)Math.Pow(2, hostBits);

            var ips = new List<string>();
            for (int i = 1; i < numberOfIps - 1; i++) 
            {
                var newIp = baseAddress + (uint)i;
                var bytes = BitConverter.GetBytes(newIp).Reverse().ToArray();
                ips.Add(new IPAddress(bytes).ToString());
            }

            return ips;
        }
    }
}
