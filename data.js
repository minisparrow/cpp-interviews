// C++面试八股文题库数据
const questionsData = [
    {
        id: 1,
        category: "basic",
        title: "const关键字的作用",
        question: "请详细说明C++中const关键字的作用和使用场景。",
        answer: `const关键字在C++中有以下几个重要作用：

1. **修饰变量**：说明该变量不可以被改变
   - const int a = 10; // a的值不能被修改

2. **修饰指针**：
   - 指向常量的指针：const int* p 或 int const* p
   - 常量指针：int* const p（指针本身不可改变）
   - 指向常量的常量指针：const int* const p

3. **修饰引用**：指向常量的引用（reference to const）
   - 用于形参类型，避免拷贝，又避免函数对值的修改

4. **修饰成员函数**：说明该成员函数内不能修改成员变量
   - 常成员函数只能调用常成员函数

5. **与#define的区别**：
   - const有类型安全检查，#define没有
   - const分配内存，#define不分配内存
   - const在编译器处理，#define在预处理器处理`
    },
    {
        id: 2,
        category: "basic",
        title: "static关键字的作用",
        question: "static关键字在C++中有哪些用途？",
        answer: `static关键字在C++中有以下作用：

1. **修饰普通变量**：
   - 改变变量的存储区域和生命周期
   - 使变量存储在静态区，程序运行前就分配空间
   - 如果有初始值用初始值初始化，否则系统默认初始化

2. **修饰普通函数**：
   - 表明函数的作用范围仅在定义该函数的文件内
   - 防止与其他文件中的同名函数冲突

3. **修饰成员变量**：
   - 所有对象只保存一个该变量
   - 不需要生成对象就可以访问该成员
   - 静态成员变量需要在类外初始化

4. **修饰成员函数**：
   - 不需要生成对象就可以访问该函数
   - 在static函数内不能访问非静态成员
   - 没有this指针`
    },
    {
        id: 3,
        category: "oop",
        title: "虚函数的实现原理",
        question: "请详细说明C++中虚函数的实现原理和虚函数表的作用。",
        answer: `虚函数的实现原理：

1. **虚函数表（vtable）**：
   - 每个包含虚函数的类都有一个虚函数表
   - 虚函数表存储该类所有虚函数的地址
   - 虚函数表在编译期根据类的声明创建

2. **虚函数指针（vptr）**：
   - 每个含有虚函数的对象都有一个虚函数指针
   - 虚函数指针指向该对象所属类的虚函数表
   - 虚函数指针在运行时确定

3. **动态绑定过程**：
   - 通过基类指针或引用调用虚函数时
   - 程序通过对象的vptr找到虚函数表
   - 在虚函数表中找到对应的函数地址
   - 调用实际的函数实现

4. **内存布局**：
   - vptr通常位于对象内存布局的开始位置
   - 派生类继承基类的虚函数表
   - 如果派生类重写了虚函数，会覆盖虚函数表中对应的函数指针

5. **性能开销**：
   - 每个对象需要额外的vptr存储空间
   - 虚函数调用需要一次额外的间接寻址`
    },
    {
        id: 4,
        category: "oop",
        title: "纯虚函数和抽象类",
        question: "什么是纯虚函数？抽象类有什么特点？",
        answer: `纯虚函数和抽象类的概念：

1. **纯虚函数**：
   - 在基类中声明为virtual，并且=0的函数
   - 语法：virtual int func() = 0;
   - 纯虚函数没有实现，只有声明
   - 用于定义接口规范

2. **抽象类**：
   - 包含一个或多个纯虚函数的类
   - 不能直接实例化对象
   - 只能作为基类被继承
   - 可以包含普通成员函数和数据成员

3. **派生类的要求**：
   - 必须实现所有继承的纯虚函数
   - 如果没有实现全部纯虚函数，派生类仍然是抽象类
   - 实现了所有纯虚函数的派生类才能实例化

4. **使用场景**：
   - 定义接口规范，强制派生类实现特定功能
   - 实现多态性，统一接口
   - 设计模式中的模板方法模式

5. **与虚函数的区别**：
   - 虚函数有默认实现，纯虚函数没有
   - 虚函数可以不被重写，纯虚函数必须被重写
   - 包含纯虚函数的类不能实例化`
    },
    {
        id: 5,
        category: "stl",
        title: "vector的实现原理",
        question: "请说明STL中vector容器的底层实现原理和扩容机制。",
        answer: `vector的实现原理：

1. **底层数据结构**：
   - 动态数组，在堆上分配连续的内存空间
   - 三个重要指针：start（起始位置）、finish（结束位置）、end_of_storage（容量结束）

2. **扩容机制**：
   - 当插入元素超过当前容量时触发扩容
   - 通常按1.5倍或2倍的倍数扩容
   - 分配新的更大内存空间
   - 将原有元素拷贝到新空间
   - 释放原有内存空间

3. **时间复杂度**：
   - 随机访问：O(1)
   - 尾部插入/删除：平摊O(1)
   - 中间插入/删除：O(n)
   - 查找：O(n)

4. **内存管理**：
   - 预分配内存，减少频繁的内存分配
   - capacity()返回当前容量
   - size()返回当前元素个数
   - reserve()可以预先分配内存

5. **迭代器失效**：
   - 扩容时所有迭代器失效
   - 插入操作可能导致插入位置之后的迭代器失效
   - 删除操作导致删除位置之后的迭代器失效

6. **优缺点**：
   - 优点：随机访问快，内存局部性好
   - 缺点：中间插入删除慢，扩容时有性能损失`
    },
    {
        id: 6,
        category: "stl",
        title: "map和unordered_map的区别",
        question: "请详细比较map和unordered_map的区别，包括底层实现和性能特点。",
        answer: `map和unordered_map的详细比较：

1. **底层实现**：
   - map：基于红黑树（平衡二叉搜索树）
   - unordered_map：基于哈希表

2. **时间复杂度**：
   - map：查找、插入、删除都是O(log n)
   - unordered_map：平均O(1)，最坏O(n)

3. **内存使用**：
   - map：每个节点需要额外的指针存储（左右子树、父节点）
   - unordered_map：需要额外的桶（bucket）空间

4. **元素顺序**：
   - map：元素按key自动排序（默认升序）
   - unordered_map：元素无序存储

5. **迭代器稳定性**：
   - map：插入删除操作不会影响其他元素的迭代器
   - unordered_map：rehash时所有迭代器失效

6. **适用场景**：
   - map：需要有序遍历、范围查询
   - unordered_map：频繁查找、对顺序无要求

7. **key的要求**：
   - map：key需要支持比较操作（<）
   - unordered_map：key需要支持哈希函数和相等比较

8. **性能考虑**：
   - 数据量小时，map可能更快（缓存友好）
   - 数据量大时，unordered_map通常更快`
    },
    {
        id: 7,
        category: "memory",
        title: "智能指针的种类和使用",
        question: "C++11中有哪些智能指针？它们的区别和使用场景是什么？",
        answer: `C++11智能指针详解：

1. **unique_ptr**：
   - 独占所有权的智能指针
   - 不能复制，只能移动
   - 适用于单一所有者的资源管理
   - 开销最小，接近原生指针

2. **shared_ptr**：
   - 共享所有权的智能指针
   - 使用引用计数管理资源
   - 多个shared_ptr可以指向同一对象
   - 最后一个shared_ptr析构时释放资源

3. **weak_ptr**：
   - 不拥有资源的观察者指针
   - 配合shared_ptr使用，解决循环引用问题
   - 可以检查所指向的对象是否还存在
   - 需要通过lock()获得shared_ptr来访问对象

4. **使用场景**：
   - unique_ptr：工厂函数返回值、PIMPL惯用法
   - shared_ptr：多个对象需要共享同一资源
   - weak_ptr：观察者模式、打破循环引用

5. **性能对比**：
   - unique_ptr：几乎无开销
   - shared_ptr：有引用计数开销，线程安全
   - weak_ptr：需要额外的控制块

6. **最佳实践**：
   - 优先使用unique_ptr
   - 必要时使用shared_ptr
   - 用weak_ptr解决循环引用
   - 避免使用裸指针管理动态内存`
    },
    {
        id: 8,
        category: "memory",
        title: "内存泄漏的原因和避免方法",
        question: "C++中内存泄漏的常见原因有哪些？如何避免？",
        answer: `内存泄漏的原因和避免方法：

1. **常见原因**：
   - new/delete不匹配
   - 异常安全问题（异常抛出导致delete未执行）
   - 循环引用（shared_ptr循环引用）
   - 容器中存储指针未正确释放
   - 复制构造函数/赋值运算符未正确实现

2. **避免方法**：

   **使用智能指针**：
   - unique_ptr管理独占资源
   - shared_ptr管理共享资源
   - weak_ptr打破循环引用

   **RAII（资源获取即初始化）**：
   - 在构造函数中获取资源
   - 在析构函数中释放资源
   - 利用栈对象的自动析构

   **异常安全编程**：
   - 使用智能指针避免异常导致的内存泄漏
   - 遵循强异常安全保证

3. **检测工具**：
   - Valgrind（Linux）
   - AddressSanitizer
   - Visual Studio诊断工具
   - 静态分析工具

4. **最佳实践**：
   - 优先使用标准库容器
   - 避免手动内存管理
   - 遵循三/五法则
   - 编写异常安全的代码
   - 定期进行内存泄漏检测`
    },
    {
        id: 9,
        category: "advanced",
        title: "模板特化和偏特化",
        question: "什么是模板特化和偏特化？它们的使用场景是什么？",
        answer: `模板特化和偏特化详解：

1. **模板特化（全特化）**：
   - 为特定类型提供完全不同的实现
   - 语法：template<> class MyClass<int> { ... };
   - 编译器优先选择特化版本

2. **模板偏特化（部分特化）**：
   - 只能用于类模板，不能用于函数模板
   - 为模板参数的子集提供特化实现
   - 语法：template<typename T> class MyClass<T*> { ... };

3. **使用场景**：

   **全特化场景**：
   - 为特定类型优化性能
   - 为特殊类型提供不同行为
   - 类型安全检查

   **偏特化场景**：
   - 指针类型的特殊处理
   - 引用类型的特殊处理
   - 容器类型的特殊处理

4. **选择规则**：
   - 编译器选择最特化的版本
   - 全特化 > 偏特化 > 主模板
   - 偏特化之间选择最匹配的

5. **实例**：
   \`\`\`cpp
   // 主模板
   template<typename T, typename U>
   class MyClass { ... };

   // 偏特化：第二个参数为int
   template<typename T>
   class MyClass<T, int> { ... };

   // 全特化：两个参数都是int
   template<>
   class MyClass<int, int> { ... };
   \`\`\`

6. **注意事项**：
   - 特化必须在主模板声明之后
   - 函数模板只能全特化，不能偏特化
   - 偏特化的模板参数不能比主模板更多`
    },
    {
        id: 10,
        category: "advanced",
        title: "移动语义和完美转发",
        question: "请解释C++11中的移动语义和完美转发的概念及其作用。",
        answer: `移动语义和完美转发详解：

1. **移动语义（Move Semantics）**：
   - 避免不必要的拷贝操作，提高性能
   - 通过"偷取"资源而不是复制资源
   - 左值引用（&）和右值引用（&&）

2. **右值引用**：
   - T&& 表示右值引用
   - 可以绑定到临时对象
   - 允许修改临时对象

3. **移动构造函数和移动赋值**：
   \`\`\`cpp
   class MyClass {
   public:
       // 移动构造函数
       MyClass(MyClass&& other) noexcept
           : data(std::move(other.data)) {
           other.data = nullptr;
       }
       
       // 移动赋值运算符
       MyClass& operator=(MyClass&& other) noexcept {
           if (this != &other) {
               delete[] data;
               data = other.data;
               other.data = nullptr;
           }
           return *this;
       }
   };
   \`\`\`

4. **完美转发（Perfect Forwarding）**：
   - 保持参数的值类别（左值/右值）
   - 使用std::forward实现
   - 主要用于模板函数参数转发

5. **万能引用（Universal Reference）**：
   - T&& 在模板中可能是左值引用或右值引用
   - 通过引用折叠规则确定最终类型
   - T& && → T&, T&& && → T&&

6. **性能优势**：
   - 避免深拷贝，特别是容器类
   - 提高临时对象的处理效率
   - 减少内存分配和释放

7. **最佳实践**：
   - 移动操作应该是noexcept的
   - 使用std::move转换为右值
   - 在构造函数和赋值运算符中使用移动语义`
    },
    {
        id: 11,
        category: "algorithm",
        title: "排序算法的时间复杂度",
        question: "常见排序算法的时间复杂度和空间复杂度是多少？",
        answer: `常见排序算法复杂度分析：

1. **冒泡排序（Bubble Sort）**：
   - 时间复杂度：O(n²)
   - 空间复杂度：O(1)
   - 稳定性：稳定

2. **选择排序（Selection Sort）**：
   - 时间复杂度：O(n²)
   - 空间复杂度：O(1)
   - 稳定性：不稳定

3. **插入排序（Insertion Sort）**：
   - 时间复杂度：O(n²)，最好O(n)
   - 空间复杂度：O(1)
   - 稳定性：稳定

4. **快速排序（Quick Sort）**：
   - 时间复杂度：平均O(n log n)，最坏O(n²)
   - 空间复杂度：O(log n)
   - 稳定性：不稳定

5. **归并排序（Merge Sort）**：
   - 时间复杂度：O(n log n)
   - 空间复杂度：O(n)
   - 稳定性：稳定

6. **堆排序（Heap Sort）**：
   - 时间复杂度：O(n log n)
   - 空间复杂度：O(1)
   - 稳定性：不稳定

7. **计数排序（Counting Sort）**：
   - 时间复杂度：O(n + k)，k为数据范围
   - 空间复杂度：O(k)
   - 稳定性：稳定

8. **基数排序（Radix Sort）**：
   - 时间复杂度：O(d × (n + k))，d为位数
   - 空间复杂度：O(n + k)
   - 稳定性：稳定

9. **选择建议**：
   - 小数据量：插入排序
   - 一般情况：快速排序
   - 需要稳定性：归并排序
   - 内存受限：堆排序`
    },
    {
        id: 12,
        category: "algorithm",
        title: "二分查找的实现和变种",
        question: "如何实现二分查找？有哪些常见的变种？",
        answer: `二分查找详解：

1. **基本二分查找**：
   \`\`\`cpp
   int binarySearch(vector<int>& nums, int target) {
       int left = 0, right = nums.size() - 1;
       while (left <= right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] == target) {
               return mid;
           } else if (nums[mid] < target) {
               left = mid + 1;
           } else {
               right = mid - 1;
           }
       }
       return -1;
   }
   \`\`\`

2. **查找第一个等于目标值的位置**：
   \`\`\`cpp
   int findFirst(vector<int>& nums, int target) {
       int left = 0, right = nums.size() - 1;
       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] < target) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return nums[left] == target ? left : -1;
   }
   \`\`\`

3. **查找最后一个等于目标值的位置**：
   \`\`\`cpp
   int findLast(vector<int>& nums, int target) {
       int left = 0, right = nums.size() - 1;
       while (left < right) {
           int mid = left + (right - left + 1) / 2;
           if (nums[mid] > target) {
               right = mid - 1;
           } else {
               left = mid;
           }
       }
       return nums[left] == target ? left : -1;
   }
   \`\`\`

4. **查找第一个大于目标值的位置**：
   - 找到插入位置的上界

5. **查找最后一个小于目标值的位置**：
   - 找到插入位置的下界

6. **注意事项**：
   - 防止整数溢出：mid = left + (right - left) / 2
   - 边界条件的处理
   - left < right vs left <= right
   - mid的计算方式影响循环终止条件

7. **应用场景**：
   - 有序数组查找
   - 旋转数组查找
   - 寻找峰值
   - 平方根计算`
    }
];

// 分类映射
const categoryMap = {
    all: "全部",
    basic: "基础语法",
    oop: "面向对象",
    stl: "STL容器",
    memory: "内存管理",
    advanced: "高级特性",
    algorithm: "算法"
};

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questionsData, categoryMap };
}
