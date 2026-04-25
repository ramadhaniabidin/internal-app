using PostgreMVCApp.Data;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFProductService
    {
        private readonly AppDbContext _context;
        public EFProductService(AppDbContext context)
        {
            _context = context;
        }
        public List<Product> GetAllProducts()
        {
            return [.. _context.Products];
        }

        public Product? GetProduct(int id)
        {
            return _context.Products.Find(id);
        }

        public void AddProduct(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
        }

        public void UpdateProduct(Product product)
        {
            _context.Products.Update(product);
            _context.SaveChanges();
        }

        public void DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
        }
    }
}
